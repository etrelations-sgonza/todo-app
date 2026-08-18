# GitHub Actions Workflow Setup Guide

This guide explains how to set up the GitHub Actions workflows with Kiro CLI and AWS authentication.

## Prerequisites

- GitHub repository (already created: `etrelations-sgonza/todo-app`)
- AWS account with appropriate permissions
- Ability to configure AWS IAM and OIDC

## Step 1: Configure AWS OIDC Provider

1. Go to AWS IAM Console → Identity Providers
2. Click "Create Provider"
3. Select "OpenID Connect"
4. Configure:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
   - **Thumbprint**: Get from GitHub (usually auto-populated)
5. Click "Create"

## Step 2: Create IAM Role for GitHub Actions

1. Go to AWS IAM Console → Roles
2. Click "Create Role"
3. Select "Custom Trust Policy" and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:etrelations-sgonza/todo-app:*"
        }
      }
    }
  ]
}
```

Replace `ACCOUNT_ID` with your AWS account ID.

4. Continue and attach the inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "q:StartConversation",
        "q:SendMessage",
        "q:GetConversation"
      ],
      "Resource": "*"
    }
  ]
}
```

5. Name the role (e.g., `github-actions-todo-app-role`)
6. Click "Create Role"

## Step 3: Add AWS Role ARN to Repository Secrets

1. Go to GitHub Repository Settings → Secrets and Variables → Actions
2. Click "New Repository Secret"
3. Create secret with:
   - **Name**: `AWS_ROLE_ARN`
   - **Value**: `arn:aws:iam::ACCOUNT_ID:role/github-actions-todo-app-role`
4. Click "Add Secret"

## Step 4: Verify Workflow Setup

The workflows are now configured and ready to use:

### Workflow Files
- `.github/workflows/kiro-setup.yml` - Installs and verifies Kiro CLI
- `.github/workflows/deploy-todo-app.yml` - Deploys the to-do application

### Trigger Events
Both workflows trigger on:
- Push to `main` branch
- Pull requests to `main` branch
- Manual dispatch (Workflow → Run workflow)

## Step 5: Test the Workflows

1. Make a commit to the `main` branch or manually trigger the workflow
2. Go to GitHub Actions tab
3. Monitor workflow execution
4. Check logs for:
   - ✓ AWS credentials configuration
   - ✓ Kiro CLI installation
   - ✓ Version verification
   - ✓ Application deployment

## Workflow Details

### Kiro Setup Workflow

**Jobs**:
1. **setup-kiro**
   - Checks out code
   - Configures AWS credentials via OIDC
   - Installs Kiro CLI v1.0.3
   - Verifies installation
   - Displays version info

2. **test-kiro-auth**
   - Depends on `setup-kiro` job
   - Tests Kiro CLI with AWS SigV4 authentication
   - Validates authentication configuration

**Configuration**:
- AWS Region: `us-east-1`
- SigV4 Authentication: Enabled
- Checksum Verification: Enabled

### Deployment Workflow

**Job**: `deploy`
- Verifies application files
- Builds deployment artifacts (HTML, CSS, JS)
- Prepares S3 deployment configuration
- Outputs deployment summary

## AWS SigV4 Authentication

The workflows use AWS SigV4 authentication for secure API calls:

```yaml
- name: Setup Kiro CLI
  uses: clouatre-labs/setup-kiro-action@v1.0.3
  with:
    aws-region: us-east-1
    enable-sigv4: true
    verify-checksum: true
```

**Benefits**:
- Secure credential handling (no long-term credentials)
- OIDC-based authentication
- Temporary security credentials
- Automatic credential rotation
- Audit trail in CloudTrail

## Troubleshooting

### Workflow Fails with "Access Denied"
- Verify AWS role ARN is correct
- Check IAM policy permissions
- Ensure OIDC provider thumbprint matches

### Kiro CLI Installation Fails
- Check internet connectivity in runner
- Verify checksum verification isn't too strict
- Review action logs for specific errors

### AWS Credentials Not Configured
- Verify `AWS_ROLE_ARN` secret is set
- Check repository has access to secret
- Ensure OIDC provider is properly configured

### SigV4 Authentication Issues
- Verify AWS region is correct
- Check IAM role permissions for Kiro CLI actions
- Review AWS CloudTrail logs

## Security Best Practices

1. **Least Privilege**: IAM role should only have necessary permissions
2. **Branch Protection**: Restrict deployments to protected branches
3. **OIDC Configuration**: Limit scope to specific repository/branch
4. **Audit Logging**: Enable CloudTrail for AWS action monitoring
5. **Secret Rotation**: Regularly review and update OIDC configuration

## Next Steps

1. ✅ Configure AWS OIDC Provider
2. ✅ Create IAM Role with trust policy
3. ✅ Add `AWS_ROLE_ARN` secret to repository
4. ✅ Test workflows
5. ✅ Monitor deployments in GitHub Actions
6. ✅ Set up S3 deployment (optional)
7. ✅ Configure additional AWS resources as needed

## Additional Resources

- [GitHub Actions with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [AWS OIDC Provider Setup](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [Kiro CLI Documentation](https://github.com/clouatre-labs/setup-kiro-action)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

For questions or issues, refer to the main README.md file.
