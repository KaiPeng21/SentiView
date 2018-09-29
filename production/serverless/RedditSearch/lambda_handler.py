
# Sample API Input
# {
#     "entities" : [
#         {
#             "search" : ["Amazon", "acquire", "Wholefood"]
#         }
#     ]
# }

import boto3
import praw
import os

def lambda_handler(event, context):

    # Get environment variables
    PRAW_CLIENT_ID = os.environ["PRAW_CLIENT_ID"]
    PRAW_CLIENT_SECRET = os.environ["PRAW_CLIENT_SECRET"]

    # Get Search key phrases
    search_query = event["entities"][0]["search"]
    search_query = " ".join(search_query)
    
    # Initialize Reddit Connection
    reddit = praw.Reddit(client_id=PRAW_CLIENT_ID,
                     client_secret=PRAW_CLIENT_SECRET,
                     user_agent="user agent")
    reddit.read_only=True

    # Search the Top 10 Hottest Submissions from Reddit
    submissions = reddit.subreddit('all').search(query=search_query, sort='hot', limit=10)

    for submission in submissions:
        # Notify SentiViewSentiment to perform sentiment analysis and finding keyphrases in the submission
        all_comments = '\n'.join([comment.body for comment in submission.comments.list()])
        print(all_comments)
        
        # Store the data into database

        # print(submission.id)     # Output: the submission's ID
        # print(submission.title)  # Output: the submission's title
        # print(submission.url)    # Output: the URL the submission points to
        preview = submission.selftext[:100]


if __name__ == "__main__":

    test = {
        "entities" : [
            {
                "search" : ["Amazon", "acquire", "Wholefood"]
            }
        ]
    }

    lambda_handler(test, '')



