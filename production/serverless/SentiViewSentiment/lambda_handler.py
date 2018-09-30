import boto3
import os
import ast
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    DB_COMMENT_TABLE_NAME = os.environ["DB_COMMENT_TABLE_NAME"]
    DB_SUBMISSION_TABLE_NAME = os.environ["DB_SUBMISSION_TABLE_NAME"]

    dynamodb = boto3.resource('dynamodb')

    # Getting SNS message
    message = event['Records'][0]['Sns']['Message']
    message = ast.literal_eval(message)
    postType = message['type']
    postID = ''
    table = None
    key = ''
    if postType == 'SUBMISSION':
        postID = message['submission_id']
        table = dynamodb.Table(DB_SUBMISSION_TABLE_NAME)
        key = 'submission_id'
    else:
        postID = message['comment_id']
        table = dynamodb.Table(DB_COMMENT_TABLE_NAME)
        key = 'comment_id'

    # Retrieving information about the post from DynamoDB table
    postItem = table.query(
        KeyConditionExpression=Key(key).eq(postID)
    )
    text = postItem['Items'][0]['content']

    # perform sentiment analysis
    comprehend = boto3.client('comprehend')
    sentimentResponse = comprehend.detect_sentiment(
        Text=text,
        LanguageCode='en'
    )
    sentimentScore = sentimentResponse['SentimentScore']
    sentimentLabel = sentimentResponse['Sentiment']

    # updating DynamoDB
    response = table.update_item(
        Key={key:postID},
        UpdateExpression="SET #statusAtt = :statusValue, #sentimentAtt = :sentimentValue, #positiveAtt = :positiveValue, #neutralAtt = :neutralValue, #negativeAtt = :negativeValue, #mixedAtt = :mixedValue",                   
        ExpressionAttributeValues={':statusValue': 'UPDATED', ':sentimentValue': sentimentLabel, ':positiveValue': str(round(sentimentScore['Positive'], 3)), ':neutralValue': str(round(sentimentScore['Neutral'], 3)), ':negativeValue': str(round(sentimentScore['Negative'], 3)), ':mixedValue': str(round(sentimentScore['Mixed'], 3))},
        ExpressionAttributeNames={'#statusAtt': 'sentiment_status', '#sentimentAtt': 'sentiment', '#positiveAtt': 'positive','#neutralAtt': 'neutral','#negativeAtt': 'negative','#mixedAtt': 'mixed'}
    )
    
    return