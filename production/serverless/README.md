## Serverless Backend

**GetSentiView:** A lambda function that interfaces with the API Gateway and the database. Send the submission and comment data from DynamoDB to the client over HTTP protocol.

**RedditSearch:** A lambda function that interfaces with the API Gateway, the external Reddit API, and the database. Stores the Reddit submission and comments into the database, and triggers other lambda functions to process the audio generation as well as sentiment analysis in an asynchronous fashion.

**SentiViewSentiment:** A lambda function that is triggered by the RedditSearch lambda function. It uses the machine learning algorithm from Amazon Comprehend to determine the emotional scores of a Reddit submission or comment.

**SentiViewAudio:** A lambda function that is triggered by the RedditSearch lambda function. It generates and stores audio files into S3 using the AWS Polly service.

## API User Guide

**Invoke URL:** https://lbpqy5ek0d.execute-api.us-east-1.amazonaws.com/prod

### HTTP GET

?search="[search key word]"

### HTTP POST 

```
{
    "entities" : [
        {
    	    "search" : ["Search Key Word"]
        }
    ]
}
```