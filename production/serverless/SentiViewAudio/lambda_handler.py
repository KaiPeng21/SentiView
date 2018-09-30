import boto3
import os
import ast
from contextlib import closing
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    DB_COMMENT_TABLE_NAME = os.environ["DB_COMMENT_TABLE_NAME"]
    DB_SUBMISSION_TABLE_NAME = os.environ["DB_SUBMISSION_TABLE_NAME"]
    SENTIVIEW_AUDIO_BUCKET = os.environ["SENTIVIEW_AUDIO_BUCKET"]

    dynamodb = boto3.resource('dynamodb')
    s3_resource = boto3.resource('s3')
    s3 = boto3.client('s3')

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
        
    # If audio already exist in S3, terminate this lambda function
    bucket = s3_resource.Bucket(SENTIVIEW_AUDIO_BUCKET)
    objs = list(bucket.objects.filter(Prefix=f'{postID}.mp3'))
    if len(objs) > 0 and objs[0].key == f'{postID}.mp3':
        print(f'{postID}.mp3 already in S3. Terminate audio generation.')
        return

    # Retrieving information about the post from DynamoDB table
    postItem = table.query(
        KeyConditionExpression=Key(key).eq(postID)
    )

    text = postItem['Items'][0]['content']
    voice = 'Ivy'

    rest = text
    # Dividing text into blocks of approximately 1000 chars
    # because Polly is only capable of transforming text with 1500 chars
    textBlocks = []
    while len(rest) > 1100:
        begin = 0
        end = rest.find('.', 1000)
        if end == -1:
            end = rest.find(' ', 1000)

        textBlock = rest[begin:end]
        rest = rest[end:]
        textBlocks.append(textBlock)
    textBlocks.append(rest)

    # Process text to speech using polly
    polly = boto3.client('polly')
    for textBlock in textBlocks:
        response = polly.synthesize_speech(
            OutputFormat='mp3',
            Text=textBlock,
            VoiceId='Justin'
        )
        if 'AudioStream' in response:
            with closing(response['AudioStream']) as stream:
                output = os.path.join('/tmp/', postID)
                with open(output, 'ab') as f:
                    f.write(stream.read())

    # upload mp3 file to S3
    
    s3.upload_file(f'/tmp/{postID}', SENTIVIEW_AUDIO_BUCKET, f'{postID}.mp3')
    s3.put_object_acl(ACL='public-read', Bucket=SENTIVIEW_AUDIO_BUCKET, Key=f'{postID}.mp3')

    location = s3.get_bucket_location(Bucket=SENTIVIEW_AUDIO_BUCKET)
    region = location['LocationConstraint']

    url_beginning = 'https://s3.amazonaws.com/'
    if region is not None:
        url_beginning = f'https://s3-{region}.amazonaws.com/'

    url = f'{url_beginning}{SENTIVIEW_AUDIO_BUCKET}/{postID}.mp3'

    # updating DynamoDB
    response = table.update_item(
        Key={key:postID},
        UpdateExpression="SET #statusAtt = :statusValue, #urlAtt = :urlValue",                   
        ExpressionAttributeValues={':statusValue': 'UPDATED', ':urlValue': url},
        ExpressionAttributeNames={'#statusAtt': 'audio_status', '#urlAtt': 'audio'}
    )

    return