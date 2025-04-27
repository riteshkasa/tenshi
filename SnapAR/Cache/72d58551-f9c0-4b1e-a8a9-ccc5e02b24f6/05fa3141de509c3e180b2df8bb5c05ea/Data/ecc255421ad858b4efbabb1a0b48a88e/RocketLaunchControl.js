"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketLaunchControl = void 0;
var __selfType = requireType("./RocketLaunchControl");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("../../../Components/Interaction/Interactable/Interactable");
const validate_1 = require("../../../Utils/validate");
// --------- DECISION‑TREE DEFINITION --------------------------------------------------------
const CPR_STEPS = {
    Start: {
        text: "Is the person breathing?",
        image: "img_breathing_check",
        yes: "BreathingRecoveryPos",
        yesLabel: "Yes",
        noLabel: "No",
        no: "NoBreathingCheckPulse",
    },
    BreathingRecoveryPos: {
        text: "Place the person in the recovery\n position and\n monitor breathing. Emergency\n services contacted?",
        image: "img_recovery_position",
        yesLabel: "Yes",
        noLabel: "No",
        yes: "End",
        no: "CallEmergencyServices",
    },
    CallEmergencyServices: {
        text: "Call emergency services \nimmediately. \nStay with the person.",
        image: "img_call_emergency",
        yesLabel: "Done",
        noLabel: "Can't Call",
        yes: "End",
        no: "SignalForHelp",
    },
    SignalForHelp: {
        text: "Shout loudly for help \nand flag down others.",
        image: "img_signal_help",
        yesLabel: "Someone coming",
        noLabel: "No one nearby",
        yes: "End",
        no: "StayAndMonitor",
    },
    StayAndMonitor: {
        text: "Stay with the person and\n monitor breathing until\n help arrives.",
        image: "img_monitor",
        yesLabel: "Stops breathing",
        noLabel: "Still breathing",
        yes: "NoBreathingCheckPulse",
        no: "End",
    },
    NoBreathingCheckPulse: {
        text: "Do they have a pulse?",
        image: "img_check_pulse",
        yes: "RescueBreathsOnly",
        yesLabel: "Yes",
        noLabel: "No",
        no: "StartChestCompressions",
    },
    RescueBreathsOnly: {
        text: "Give 1 breath every 5–6 \nseconds.Emergency \nservices contacted?",
        image: "img_rescue_breaths",
        yes: "ContinueRescueBreaths",
        no: "CallEmergencyServices",
        yesLabel: "Yes",
        noLabel: "No"
    },
    ContinueRescueBreaths: {
        text: "Continue rescue breaths \nuntil help arrives or \ncondition changes.",
        image: "img_rescue_breaths",
        yesLabel: "Person recovers",
        noLabel: "No change",
        yes: "RecoveryPosition",
        no: "ContinueRescueBreaths",
    },
    StartChestCompressions: {
        text: "Start chest compressions: 30 \ncompressions, \n2 rescue breaths.",
        image: "img_chest_compressions",
        yesLabel: "Continue",
        noLabel: "Help arrived",
        yes: "ContinueCprCycles",
        no: "End",
    },
    ContinueCprCycles: {
        text: "Keep doing cycles of 30 \ncompressions and 2 breaths.",
        image: "img_cpr_cycles",
        yesLabel: "Person recovers",
        noLabel: "No change",
        yes: "RecoveryPosition",
        no: "ContinueCprCycles",
    },
    RecoveryPosition: {
        text: "Place in recovery position and\n monitor breathing.",
        image: "img_recovery_position",
        yesLabel: "Breathing normal",
        noLabel: "Breathing stops",
        yes: "End",
        no: "StartChestCompressions",
    },
    End: {
        text: "Stay with the person. Help is \non the way.",
        image: "img_wait_help",
        yesLabel: "Restart",
        noLabel: "Exit",
        yes: "End",
    },
};
let stepKey = "Start"; // Starting point of the decision tree
const step = CPR_STEPS[stepKey];
let RocketLaunchControl = class RocketLaunchControl extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }
    onStart() {
        this.setupAnimationAButtonCallbacks();
        this.setupAnimationCButtonCallbacks();
    }
    __initialize() {
        super.__initialize();
        this.animationAButton_interactable = null;
        this.animationCButton_interactable = null;
        this.animationAButtonText = null;
        this.animationCButtonText = null;
        this.currentLaunchAnimationName = "Base Layer Rocket 1";
        this.setupAnimationAButtonCallbacks = () => {
            this.animationAButton_interactable = this.animationAButton.getComponent(Interactable_1.Interactable.getTypeName());
            (0, validate_1.validate)(this.animationAButton_interactable);
            this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton);
            this.animationAButtonText = this.animationAButton.getComponent("Text");
        };
        this.onAnimationAButton = () => {
            this.currentLaunchAnimationName = "Base Layer Rocket 1";
            this.subscribeToCurrentLaunchAnimationEndEvent();
            const currentStep = CPR_STEPS[stepKey];
            if (currentStep && currentStep.yes) {
                const nextStepKey = currentStep.yes; // Get the "yes" field of the current step
                const nextStep = CPR_STEPS[nextStepKey]; // Retrieve the next step
                if (nextStep) {
                    stepKey = nextStepKey; // Update the stepKey
                    this.animationAButtonText.text = nextStep.yesLabel; // Update the button text
                    this.flightPathText.text = nextStep.text; // Update the text to the new step's text
                }
                else {
                    this.flightPathText.text = "No further steps available.";
                }
            }
            else {
                this.flightPathText.text = "No further steps available.";
            }
        };
        this.setupAnimationCButtonCallbacks = () => {
            this.animationCButton_interactable = this.animationCButton.getComponent(Interactable_1.Interactable.getTypeName());
            (0, validate_1.validate)(this.animationCButton_interactable);
            this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton);
            this.animationCButtonText = this.animationCButton.getComponent("Text");
        };
        this.onAnimationCButton = () => {
            this.currentLaunchAnimationName = "Base Layer Rocket 3";
            this.subscribeToCurrentLaunchAnimationEndEvent();
            // Dynamically retrieve the current step based on the updated stepKey
            const currentStep = CPR_STEPS[stepKey];
            if (currentStep && currentStep.no) {
                const nextStepKey = currentStep.no; // Get the "no" field of the current step
                const nextStep = CPR_STEPS[nextStepKey]; // Retrieve the next step
                if (nextStep) {
                    stepKey = nextStepKey; // Update the stepKey
                    this.flightPathText.text = nextStep.text; // Update the text to the new step's text
                }
                else {
                    this.flightPathText.text = "No further steps available.";
                }
            }
            else {
                this.flightPathText.text = "No further steps available.";
            }
        };
        this.subscribeToCurrentLaunchAnimationEndEvent = () => {
            let currentAnimationClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName);
            let flightEndTimestamp = currentAnimationClip.duration;
            currentAnimationClip.animation.createEvent("flightEnded", flightEndTimestamp);
        };
    }
};
exports.RocketLaunchControl = RocketLaunchControl;
exports.RocketLaunchControl = RocketLaunchControl = __decorate([
    component
], RocketLaunchControl);
//# sourceMappingURL=RocketLaunchControl.js.map