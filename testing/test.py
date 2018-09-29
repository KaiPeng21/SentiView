import praw
import os

reddit = praw.Reddit(client_id=os.environ['PRAW_CLIENT_ID'],
                     client_secret=os.environ['PRAW_CLIENT_SECRET'],
                     user_agent='my user agent')
reddit.read_only=True

que = 'amazon acquire wholefood'
for submission in reddit.subreddit('all').search(query=que, sort='hot', limit=10):
    print(submission.title)  # Output: the submission's title
    print(submission.id)     # Output: the submission's ID
    print(submission.url)    # Output: the URL the submission points to
    
    for comment in submission.comments.list():
        print(comment.body)
    
    # for top_level_comment in submission.comments.replace_more(limit=None)[:3]:
    #     print(top_level_comment.body)

    print('------------------')