# Credentials Folder


## Overview

This folder **MUST** contain essential tutorials, credentials, and information for the CTO or other authorized members of the 
company to securely access various components of the application. Please follow the instructions carefully to ensure 
proper access and management of the infrastructure. The `GitHub Master` or the `Technical Writer` are responsible for keeping this section 
up to date with the latest information.

## Contents

- **SSH Access to Cloud Server**
---
## Option 1: For Linux / macOS Users

This method uses your built-in terminal and SSH client.

### 1. Save the Private Key File:

Save the `.pem` file (e.g., `CodingGators.pem`) in a secure and easily accessible location on your computer. A common and good practice is to place it in your user's SSH directory: `~/.ssh/`.

**Example**: If your username is `johndoe`, save it to `/home/johndoe/.ssh/CodingGators.pem` (Linux) or `/Users/johndoe/.ssh/CodingGators.pem` (macOS).

### 2. Set File Permissions:

1.  Open your terminal.
2.  Navigate to the directory where you saved the `.pem` file (e.g., `cd ~/.ssh/`).
3.  Run the following command to set the correct permissions. This makes the file readable only by you:

    ```bash
    chmod 400 CodingGators.pem
    ```

### 3. Connect to the EC2 Instance:

1.  Open your terminal.
2.  Navigate to the directory where you saved the `.pem` file (e.g., `cd ~/.ssh/`).
3.  Use the following SSH command:

    ```bash
    ssh -i "CodingGators.pem" ubuntu@ec2-3-147-96-129.us-east-2.compute.amazonaws.com
    ```

    * Replace `/path/to/your/CodingGators.pem` with the full path to your `.pem` file (e.g., `~/.ssh/CodingGators.pem`).
    * Replace `ubuntu` with the default username (which is `ubuntu` for Ubuntu 22.04).

### 4. First-Time Connection:

The first time you connect, you might see a warning about the host's authenticity. Type `yes` and press `Enter` to continue.

---

## Option 2: For Windows Users

If you have Git Bash installed (which comes with Git for Windows) or Windows Subsystem for Linux (WSL), you can follow the Linux/macOS instructions, as these provide a Unix-like terminal environment.

1.  **Install Git Bash or WSL**: If you don't have them, download and install Git Bash from [git-scm.com](https://git-scm.com/) or enable WSL from Microsoft.
2.  Open Git Bash or WSL Terminal.
3.  Follow Steps 1-4 from "For Linux / macOS Users" above. When saving the `.pem` file, place it somewhere accessible within your Windows file system (e.g., `C:\Users\YourUsername\.ssh\`).

- **SSH Access to Database**
  - Tutorial for accessing the database server securely using SSH.
  - Details on database credentials, security best practices, and maintaining access logs.

- **API Keys and Secret Management**
  - Instructions on how to securely store, retrieve, and rotate API keys and other sensitive secrets.
  - Includes guidance on using vaults or environment variables for enhanced security.


## Security Guidelines

- **Access Control**
  - Ensure that only authorized personnel have access to the credentials in this folder.
  - Regularly review and update access permissions to maintain security.

- **Key Rotation**
  - Follow the recommended practices for rotating SSH keys, API keys, and other sensitive credentials.
  - Update the documentation in this folder whenever changes are made.

- **Incident Reporting**
  - Report any suspicious activity or potential security breaches immediately.
  - Follow the company's incident response procedures as outlined in the security policy.

## Contact Information

If you encounter any issues or require additional access, please contact the CTO or the designated team member 
responsible for cloud instance management. Ensure all communications are secure and adhere to the team's security protocols.

--- 

**Credentials Folder:** 🎯 Target locked!. This folder is the vault that holds the keys to the 
kingdom—**do not** rename it, or you might open a portal to chaos! The CTO has a sixth sense for these things, 
and we’d hate to see what happens if this folder goes rogue. Stay tuned for more secrets when we hit Milestone 1! 🔐


---



