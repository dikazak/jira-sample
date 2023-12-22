package com.zebrunner.app;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.plugin.webfragment.contextproviders.AbstractJiraContextProvider;
import com.atlassian.jira.plugin.webfragment.model.JiraHelper;
import com.atlassian.jira.user.ApplicationUser;

import java.util.HashMap;
import java.util.Map;

public class JiraIssueContextProvider extends AbstractJiraContextProvider {

    @Override
    public Map<String, Object> getContextMap(ApplicationUser applicationUser, JiraHelper jiraHelper) {
        Map<String, Object> context = new HashMap<>();

        Issue issue = (Issue) jiraHelper.getContextParams().get("issue");
        context.put("issueKey", issue.getKey());

        return context;
    }

}
