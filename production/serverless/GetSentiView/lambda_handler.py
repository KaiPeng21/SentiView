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
    # Get environmental variables
    DB_SUBMISSION_TABLE_NAME = os.environ["DB_SUBMISSION_TABLE_NAME"]
    DB_COMMENT_TABLE_NAME = os.environ["DB_COMMENT_TABLE_NAME"]

    # Retrieve data from database
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

    # Format Submission API
    submission_list = submission_items['Items']
    comment_list = comment_items['Items']
    comment_associative_arr = {}
    comment_stat_histogram = {'POSITIVE' : 0, 'NEUTRAL' : 0, 'NEGATIVE' : 0, 'MIXED' : 0}
    for comment_item in comment_list:
        comment_id = comment_item['comment_id']
        del comment_item['search_keywords']
        del comment_item['comment_id']
        comment_associative_arr[comment_id] = comment_item
        comment_stat_histogram[comment_item['sentiment']] += 1

    for submission_item in submission_list:
        submission_item['comments'] = list(map(lambda x: comment_associative_arr[x], submission_item['comments']))
        del submission_item['search_keywords']
        del submission_item['submission_id']

    return {
        "submissions" : submission_items['Items'],
        "stat" : comment_stat_histogram
    }

if __name__ == "__main__":
    
    test = {
        "search" : "Microsoft"
    }
    response = lambda_handler(test, '')
    print(20*'-')
    print(response)