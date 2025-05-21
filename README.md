# AWS-Item-Manager
A creative simulation of the Path of Exile item system and market using AWS services for educational purposes.
<br><br>
# Status
**In Progress**

This project is still being actively developed.

<br><br>
## Goals
The main goal of this project is to gain hands-on experience with:

**AWS services**: Lambda, IAM roles, API Gateway, S3, SQS

**NoSQL databases**: DynamoDB and DocumentDB

**Infrastructure as Code**: Terraform

I chose to model the system after my favorite game, Path of Exile, to make the learning process more engaging and to explore whether DynamoDB and DocumentDB are suitable for complex item systems like POE.
<br><br>
## Architecture

![itemstore drawio](https://github.com/user-attachments/assets/4f6acbe1-55fb-4d16-b1bd-8298c30eb375)

**User_api API Gateway**: Entry point for HTTP requests from game servers and external tools. (Planned: Different access levels for servers and tools.)

**User_api Lambda Function**: Handles user data such as filters, stashes, characters, and items.

**DynamoDB**: Stores user data like profile, characters, stashes and items related to them.

**S3**: Stores item filter logic, which can be up to 1mb, to reduce DynamoDB WCU/RCU costs.

**Market_api Lambda Function**: (Planned) Handles items listed for sale by users.

**SQS**: (Planned) Queues public premium stash items for insertion into DocumentDB and market listing by Market_api.

**DocumentDB**: (Planned) Provides advanced filtering for market items.

<br><br>
## User_Api 

Distributes public data to users outside the game.

Would be used to Syncs data between local game servers and the cloud.

<br><br>
## user_league_data table structure and potential usage

![image](https://github.com/user-attachments/assets/a58aca66-5636-49ce-ba80-74ce795ef354)
![image](https://github.com/user-attachments/assets/e2131945-58a0-456d-9a26-93bc34772e59)

<br><br>
## item table structure and potential usage

![image](https://github.com/user-attachments/assets/dce64daa-a190-4c6f-b173-72ff2c2936d5)
![image](https://github.com/user-attachments/assets/c97a8438-f06d-4dc3-8d59-a4882dc1a98b)

<br><br>
## Market_Api
**Planned**

Will handle item item put, update and query operations. 

Will provide endpoints for looking up these items.
  
<br><br>
## TODO:

-Add middleware for verifying request inputs

-Add a check in github action to only build new erc images if lambda directories changed

-Move authentication outside of user_api

-Restrict certain endpoints to server-only access

-Explore Kubernetes for CI/CD improvements

-Add unit tests for basic test coverage

-Implement the market_api component
  
<br><br>
## Conclusion:
This project so far has been a valuable learning experience. While DynamoDB is powerful, I found that for user data with many relationships (like in Path of Exile), a relational database such as PostgreSQL (as used by GGG) would probably be more efficient. Retrieving all stash and item data in DynamoDB can require 10–100 times more requests compared to a single SQL join—though it’s possible this is partly due to my current level of experience with NoSQL data modeling.

I considered storing all items and stashes in a single partition, but this approach would have required much more complex code to correctly map all the data to the appropriate stashes, items, or characters. And in the end it still would have required more requests to the database as there's a 1mb limit to a single query. This problem would be mitigated by storing item ids in stash objects and using BatchGet, which in the end i still ended up using in my partition aproach to reduce read request amount, but i feel like it's quite an ugly aproach adding more complexity to the code.

Of course, DynamoDB excels at scaling. Handling the required IOPS—potentially 30,000 or more, with a significant portion being writes—would be a major challenge for a traditional PostgreSQL setup. DynamoDB’s ability to handle such scale is a significant advantage.

Although I feel that DynamoDB may not be the best fit for this specific use case, I still see its potential and believe it could be made to work with the right optimizations. Overall, experimenting with and optimizing DynamoDB has been a highly educational experience.


