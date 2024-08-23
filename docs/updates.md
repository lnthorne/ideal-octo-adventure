# Progress Updates

### Aug 21, 2024

- Very rough draft of what needs to be done for the homeowner
- Current user flow: welcome -> login/signup -> (tabs) home, create post, logout
- **What needs to be done next:** Need to create a seperate user for companies, they need their own login after the welcome page, their own homescreen and be able to view the posts from the homeowner.

### Aug 22, 2024

- Created two sets of users, homeowner and companyowner
- Note: When logging out of either homeowner or companyowner, you are brought directly back to the wolcome page. The user is null and thus the user type is null. Figure out a way when logging out you stay in the right path
- The companyowner can now view posts and bid on the posts. The companyowner can also view their current open bids
- The homeowner can now get an overview of the bids on their current jobs
- I like the idea of the **Glassmorphism** for the look and feel of the app. Try to find some libraries. (https://youtu.be/ao2i_sOD-z0?si=p2vrcDAdnbq_v8oP)
- **What needs to be done next:** The homeowner should be able to look at their open job postings and see the bids that have been made. The homeowner can then decline or accpet the bids. The companyowner can view past bids and current open bids. There needs to be a full screen for viewing bids from the homeowner. Also, need some database rules (deletion, waterfall)

### Aug 23, 2024

- Updated and corrected the file structure and routing
- Homeowner can now accept bids. When a bid is accepted the post is set to in progress and all other competeing bids are set to rejected.
- The companyowner can now click on his bids and view the details of both the job and the bid. Also, new modal for bidding on a job. When you bid on a project, you can no longer view it in the "View Posts" page. It gets moved to the home screen
- **What needs to be done next:** Need some database rules (deletion, waterfall), abilty to upload multiple photos per job posting, completing the schema for our data
