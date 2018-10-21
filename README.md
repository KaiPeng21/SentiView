https://devpost.com/software/sentiview

## Overview
Understand social sentiment helps companies to better understand the consumer’s feeling towards their product or their brand. This sentiment monitoring tool gives users insights about how the public feels in regards to their business and topics of interests. A company’s Public Relationship Department can utilize the tool to find the root of the problem and revise a plan to correct the negativity. Additionally, users can also analyze the social sentiment of the competitors, and develop a more innovative way to change how public reflects on their brand.

SentiView is a social media sentiment analytic tool that helps users to gather people’s opinion the hottest topic on Reddit. It uses the AI and Machine Learning algorithms from Amazon Web Services to analyze how the public perceive a topic on Reddit submissions. Users may search a topic and hit the process button to have the backend gather the hottest Reddit submissions. Users may monitor the overall statistics under the STAT tab. Users may also view sentiment performance on the individual comments. If you are lazy to read, you can click the audio button to have the AWS Polly service read the comments for you.

## Architecture

[![Architecture](https://raw.githubusercontent.com/KaiPeng21/SentiView/master/production/app/src/architecture.svg)](https://youtu.be/fedxJwtLmDc "Architecture")

The entire backend is written in Serverless using AWS lambda and API Gateway. When a user clicks the process button, a lambda function gathers its hottest submissions using the Reddit PRAW API, and notify other lambda functions to start the sentiment analysis and the audio generation over SNS. The results were stored in DynamoDB tables, and the audio file is stored in S3. When the user clicks the show button, the pre-processed data are then pulled from the DynamoDB. 

The frontend is written in React.js, React-Bootstrap, React-Sound, and Chart.js, and the web app is hosting on Amazon Simple Storage Service.

Demo Video Link:
https://www.youtube.com/watch?time_continue=1&v=fedxJwtLmDc

Demo Website:
http://sentiview.s3-website-us-east-1.amazonaws.com



