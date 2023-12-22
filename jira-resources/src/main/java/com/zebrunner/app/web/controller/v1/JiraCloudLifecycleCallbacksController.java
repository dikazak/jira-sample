package com.zebrunner.app.web.controller.v1;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/lifecycle-callbacks")
public class JiraCloudLifecycleCallbacksController {

    ObjectNode onInstall;
    ObjectNode onEnabled;
    ObjectNode onDisabled;
    ObjectNode onUninstall;

    @PostMapping("/installed")
    public void onInstall(@RequestBody ObjectNode body) {
        this.onInstall = body;
    }

    @PostMapping("/enabled")
    public void onEnabled(@RequestBody ObjectNode body) {
        this.onEnabled = body;
    }

    @PostMapping("/disabled")
    public void onDisabled(@RequestBody ObjectNode body) {
        this.onDisabled = body;
    }

    @PostMapping("/uninstalled")
    public void onUninstall(@RequestBody ObjectNode body) {
        this.onUninstall = body;
    }

}
