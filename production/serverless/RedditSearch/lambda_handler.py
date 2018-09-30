import boto3
import botocore
from boto3.dynamodb.conditions import Key, Attr
import praw
import os
import json

def lambda_handler(event, context):
    """
    Search the hottest submissions from reddit given 
    the search key phrases. Notify SentiViewSentiment
    lambda function to perform sentiment analysis on
    each submission. Store each submission's id, title,
    url, and preview text into the database.

    Sample API Input:
    {
        "entities" : [
            {
                "search" : ["Amazon", "Wholefood"]
            }
        ]
    }
    """

    # Get environment variables
    PRAW_CLIENT_ID = os.environ["PRAW_CLIENT_ID"]
    PRAW_CLIENT_SECRET = os.environ["PRAW_CLIENT_SECRET"]
    DB_COMMENT_TABLE_NAME = os.environ["DB_COMMENT_TABLE_NAME"]
    DB_SUBMISSION_TABLE_NAME = os.environ["DB_SUBMISSION_TABLE_NAME"]
    AUDIO_SNS_TOPIC = os.environ["AUDIO_SNS_TOPIC"]
    SENTIMENT_SNS_TOPIC = os.environ["SENTIMENT_SNS_TOPIC"]

    # Get search query
    search_keywords = event["entities"][0]["search"]
    search_query = " ".join(search_keywords)
    
    # Initialize connection to Reddit
    reddit = praw.Reddit(client_id=PRAW_CLIENT_ID,
                     client_secret=PRAW_CLIENT_SECRET,
                     user_agent="user agent")
    reddit.read_only=True

    # Search the hottest submissions from Reddit
    submissions = reddit.subreddit('all').search(query=search_query, sort='hot', limit=10)

    # Connect to database
    dynamoDB = boto3.resource('dynamodb')
    submission_table = dynamoDB.Table(DB_SUBMISSION_TABLE_NAME)
    comment_table = dynamoDB.Table(DB_COMMENT_TABLE_NAME)  

    sns = boto3.client('sns')
    ct_submissions = 0

    for submission in submissions:
        if ct_submissions >= 5:
            break

        # Some search results are not internal Reddit sites. Skip those.
        if ('www.reddit.com' in submission.url):
            ct_submissions += 1

            # If submission is already in the database, skip it and update search keywords if
            item = submission_table.get_item(Key={'submission_id': submission.id}) 
            if 'Item' in item.keys():
                print(f'Skipping processing article "{submission.title}"')
                existed_searchkey = set(item['Item']['search_keywords'])
                updated_searchkey = list(existed_searchkey | set(search_keywords))
                if len(updated_searchkey) > len(existed_searchkey):
                    item['Item']['search_keywords'] = updated_searchkey
                    submission_table.put_item(Item=item['Item'])
                    for comment_id in item['Item']['comments']:
                        comment_table.update_item(
                            Key={'comment_id':comment_id},
                            UpdateExpression="SET #searchAtt = :searchValue",                   
                            ExpressionAttributeValues={':searchValue': updated_searchkey},
                            ExpressionAttributeNames={'#searchAtt': 'search_keywords'}
                        )
                continue

            # Initialize submission table item
            submissionItem = {
                'submission_id' : submission.id,
                'title' : submission.title,
                'url' : submission.url,
                'content' : submission.selftext,
                'audio_status' : 'PROCESSING',
                'sentiment_status' : 'PROCESSING',
                'search_keywords' : search_keywords
            }
            if submissionItem['content'] == '':
                submissionItem['content'] = submissionItem['title']

            submissionComments = []
            for comment in submission.comments.list()[:20]:
                # Initialize comment table item
                commentItem = {
                    'comment_id' : comment.id,
                    'content' : comment.body,
                    'audio_status' : 'PROCESSING',
                    'sentiment_status' : 'PROCESSING',
                    'search_keywords' : search_keywords
                }
                submissionComments.append(comment.id)

                # Update comment table databse
                try:
                    comment_table.put_item(
                        Item=commentItem
                    )
                except botocore.exceptions.ClientError as e:
                    print(e, ' commentItem: ', commentItem)

                # Trigger audio generation 
                message = json.dumps({'type' : 'COMMENT', 'comment_id' : comment.id})
                #message = "{'type': 'COMMENT', 'comment_id', '%s'}" % comment.id
                sns.publish(
                    TopicArn=AUDIO_SNS_TOPIC,
                    Message=message
                )

                # Trigger sentiment analysis
                sns.publish(
                    TopicArn=SENTIMENT_SNS_TOPIC,
                    Message=message
                )
            
            # Update submission table databse
            submissionItem['comments'] = submissionComments
            try:
                submission_table.put_item(
                    Item=submissionItem
                )
            except botocore.exceptions.ClientError as e:
                print(e, ' submissionItem: ', submissionItem)

            # Trigger audio generation 
            message = json.dumps({'type' : 'SUBMISSION', 'submission_id' : submission.id})
            #"{'type': 'SUBMISSION', 'submission_id', '%s'}" % submission.id
            sns.publish(
                TopicArn=AUDIO_SNS_TOPIC,
                Message=message
            )

            # Trigger sentiment analysis
            sns.publish(
                TopicArn=SENTIMENT_SNS_TOPIC,
                Message=message
            )
            


if __name__ == "__main__":

    test = {
        "entities" : [
            {
                "search" : ["Microsoft"]
            }
        ]
    }

    lambda_handler(test, '')



