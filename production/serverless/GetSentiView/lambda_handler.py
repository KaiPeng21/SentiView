import boto3
import os
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    """
    
    Sample API Input:
    {
        "search" : "Microsoft"
    }

    """
    DB_SUBMISSION_TABLE_NAME = os.environ["DB_SUBMISSION_TABLE_NAME"]
    DB_COMMENT_TABLE_NAME = os.environ["DB_COMMENT_TABLE_NAME"]

    search = event["search"]
    dynamodb = boto3.resource("dynamodb")
    submission_table = dynamodb.Table(DB_SUBMISSION_TABLE_NAME)
    comment_table = dynamodb.Table(DB_COMMENT_TABLE_NAME)

    submission_items = submission_table.scan(
        FilterExpression=Attr('search_keywords').contains(search)
    )
    comment_items = comment_table.scan(
        FilterExpression=Attr('search_keywords').contains(search)
    )

    return {
        "submissions" : submission_items['Items'],
        "comments" : comment_items['Items']
    }

if __name__ == "__main__":
    
    test = {
        "search" : "Microsoft Github"
    }
    response = lambda_handler(test, '')
    print(20*'-')
    print(response)