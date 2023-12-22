const projectId = 1;
const testRunId = 1;
const username = "yourUsername";
const password = "yourPassword";
const host = "https://<yourTenant>.zebrunner.org";

main();

async function main() {
    const testRun = await getTestRun(projectId, testRunId);
    const testRunSuitesAndCases = await listTestRunCases(projectId, testRunId);

    setTestRunTitleHeader(testRun);
    addTestRunCasesRows(projectId, testRunId, testRunSuitesAndCases);
}

// DOM

function setTestRunTitleHeader(testRun) {
    const contentSection = document.getElementById("test_run_title");

    contentSection.innerHTML = testRun.title;
}

function addTestRunCasesRows(projectId, testRunId, testRunSuitesAndCases) {
    const testRunCasesTable = document.getElementById("test_run_cases");

    testRunSuitesAndCases.forEach(testRunSuiteAndCases => {
        const testSuite = testRunSuiteAndCases.testSuite;
        const testRunCases = testRunSuiteAndCases.testCases;

        for (let i = 0; i < testRunCases.length; i++) {
            addTestRunCaseRow(testRunCasesTable, i + 1, projectId, testRunId, testSuite, testRunCases[i]);
        }
    });
}

function addTestRunCaseRow(table, rowIndex, projectId, testRunId, testSuite, testRunCase) {
    const row = table.insertRow(rowIndex);

    const testSuiteTitleCell = row.insertCell(0);
    testSuiteTitleCell.innerHTML = testSuite.title;

    const testCaseKeyCell = row.insertCell(1);
    testCaseKeyCell.innerHTML = testRunCase.testCase.key;

    const testCaseTitleCell = row.insertCell(2);
    testCaseTitleCell.innerHTML = testRunCase.testCase.title;

    const issueIdOrLinkButtonCell = row.insertCell(3);
    if (testRunCase.issueId != null) {
        issueIdOrLinkButtonCell.innerHTML = testRunCase.issueId;
    } else {
        const linkButton = document.createElement('button');

        linkButton.innerHTML = 'link';
        linkButton.addEventListener(
            "click", () => onLinkButtonClicked(projectId, testRunId, testRunCase)
        );

        issueIdOrLinkButtonCell.appendChild(linkButton);
    }
}

async function onLinkButtonClicked(projectId, testRunId, testRunCase) {
    if (AP.context == null) {
        return;
    }

    clearTestRunCasesTable();

    const issueId = await getIssueId();
    await addTestRunCaseResults(projectId, testRunId, testRunCase, issueId);

    const testRunSuitesAndCases = await listTestRunCases(projectId, testRunId);
    addTestRunCasesRows(projectId, testRunId, testRunSuitesAndCases);
}

async function getIssueId() {
    if (AP.context == null) {
        return null;
    }

    const jiraContext = await AP.context.getContext()

    return jiraContext.jira.issue.key
}

function clearTestRunCasesTable() {
    const testCasesTable = document.getElementById("test_run_cases");

    testCasesTable.innerHTML = `<tr>
                                    <th>Test Suite</th>
                                    <th>Key</th>
                                    <th>Title</th>
                                    <th>Issue</th>
                                </tr>`;
}

// API

async function login(username, password) {
    const endpoint = `${host}/api/iam/v1/auth/login`;
    const payload = {
        username: username,
        password: password
    };

    const response = await axios.post(endpoint, payload);

    return response.data.authToken;
}

async function getTestRun(projectId, id) {
    const authToken = await login(username, password)

    const endpoint = `${host}/api/tcm/v1/test-runs/${id}?projectId=${projectId}`;
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    };

    const response = await axios.get(endpoint, config);

    return response.data.data;
}

async function listTestRunCases(projectId, testRunId) {
    const authToken = await login(username, password)

    const endpoint = `${host}/api/tcm/v1/test-runs/${testRunId}/test-cases?projectId=${projectId}`;
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    };

    const response = await axios.get(endpoint, config);

    return response.data.items;
}

async function addTestRunCaseResults(projectId, testRunId, testRunCase, issueId) {
    const authToken = await login(username, password)

    const endpoint = `${host}/api/tcm/v1/test-runs/${testRunId}/test-case-results:batch?projectId=${projectId}`;
    const payload = {
        items: [ 
            buildResultItem(testRunCase.testCase.id, issueId) 
        ]
    };
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    };

    await axios.post(endpoint, payload, config);
}

function buildResultItem(testCaseId, issueId) {
    return {
        testCaseId: testCaseId,
        status: {
            id: 1
        },
        issueType: "JIRA",
        issueId: issueId,
        executionTimeInMillis: 1000
    }
}
