import { Interactable } from "../../../Components/Interaction/Interactable/Interactable";
import { validate } from "../../../Utils/validate";


interface CprStep {
  text: string;
  image?: string;
  yes?: string;
  no?: string;
  yesLabel: string;
  noLabel: string;
}

// --------- DECISION‑TREE DEFINITION --------------------------------------------------------
const CPR_STEPS: Record<string, CprStep> = {
  Start: {
    text: "Is the person breathing?",
    image: "img_breathing_check",
    yes: "BreathingRecoveryPos",
    yesLabel: "Yes",
    noLabel: "No",
    no: "NoBreathingCheckPulse",
  },
  BreathingRecoveryPos: {
    text:
      "Place the person in the recovery\n position and\n monitor breathing. Emergency\n services contacted?",
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
    yesLabel: "Someone\n coming",
    noLabel: "No one\n nearby",
    yes: "End",
    no: "StayAndMonitor",
  },
  StayAndMonitor: {
    text:
      "Stay with the person and\n monitor breathing until\n help arrives.",
    image: "img_monitor",
    yesLabel: "Stops\n breathing",
    noLabel: "Still\n breathing",
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
    text:
      "Give 1 breath every 5–6 \nseconds.Emergency \nservices contacted?",
    image: "img_rescue_breaths",
    yes: "ContinueRescueBreaths",
    no: "CallEmergencyServices",
    yesLabel: "Yes",
    noLabel: "No"
  },
  ContinueRescueBreaths: {
    text:
      "Continue rescue breaths \nuntil help arrives or \ncondition changes.",
    image: "img_rescue_breaths",
    yesLabel: "Person\n recovers",
    noLabel: "No \nchange",
    yes: "RecoveryPosition",
    no: "ContinueRescueBreaths",
  },
  StartChestCompressions: {
    text:
      "Start chest compressions: 30 \ncompressions, \n2 rescue breaths.",
    image: "img_chest_compressions",
    yesLabel: "Continue",
    noLabel: "Help\n arrived",
    yes: "ContinueCprCycles",
    no: "End",
  },
  ContinueCprCycles: {
    text:
      "Keep doing cycles of 30 \ncompressions and 2 breaths.",
    image: "img_cpr_cycles",
    yesLabel: "Person\n recovers",
    noLabel: "No \nchange",
    yes: "RecoveryPosition",
    no: "ContinueCprCycles",
  },
  RecoveryPosition: {
    text: "Place in recovery position and\n monitor breathing.",
    image: "img_recovery_position",
    yesLabel: "Breathing\n normal",
    noLabel: "Breathing\n stops",
    yes: "End",
    no: "StartChestCompressions",
  },
  End: {
    text: "Stay with the person. Help is \non the way.",
    image: "img_wait_help",
    yesLabel: "",
    noLabel: "",
    yes: "End",
    no: "End"
  },
};

let stepKey: string = "Start"; // Starting point of the decision tree
const step: CprStep = CPR_STEPS[stepKey];

@component
export class RocketLaunchControl extends BaseScriptComponent {
  @input animationAButton!: SceneObject;
  @input animationCButton!: SceneObject;
  @input flightPathText!: Text;
  @input rocketAnimationPlayer!: AnimationPlayer;

  private animationAButton_interactable: Interactable | null = null;
  private animationCButton_interactable: Interactable | null = null;
  private animationAButtonText: Text | null = null;
  private animationCButtonText: Text | null = null;
  private currentLaunchAnimationName: string = "Base Layer Rocket 1";

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.onStart());
  }

  private onStart(): void {
    this.setupAnimationAButtonCallbacks();
    this.setupAnimationCButtonCallbacks();
  }

  private setupAnimationAButtonCallbacks = (): void => {
    this.animationAButton_interactable = this.animationAButton.getComponent(Interactable.getTypeName());
    validate(this.animationAButton_interactable);
    this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton);
    this.animationAButtonText = this.animationAButton.getComponent("Text");
  }

  private onAnimationAButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 1";
    this.subscribeToCurrentLaunchAnimationEndEvent();
    const currentStep = CPR_STEPS[stepKey];
    if (currentStep && currentStep.yes) {
        const nextStepKey = currentStep.yes; // Get the "yes" field of the current step
        const nextStep = CPR_STEPS[nextStepKey]; // Retrieve the next step
        if (nextStep) {
            stepKey = nextStepKey; // Update the stepKey
            this.animationAButtonText.text = nextStep.yesLabel; // Update the button text
            this.animationCButtonText.text = nextStep.noLabel; // Update the button text
            this.flightPathText.text = nextStep.text; // Update the text to the new step's text
        } else {
            this.flightPathText.text = "No further steps available.";
        }
    } else {
        this.flightPathText.text = "No further steps available.";
    }
  }

  private setupAnimationCButtonCallbacks = (): void => {
    this.animationCButton_interactable = this.animationCButton.getComponent(Interactable.getTypeName());
    validate(this.animationCButton_interactable);
    this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton);
    this.animationCButtonText = this.animationCButton.getComponent("Text");
  }

  private onAnimationCButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 3";
    this.subscribeToCurrentLaunchAnimationEndEvent();

    // Dynamically retrieve the current step based on the updated stepKey
    const currentStep = CPR_STEPS[stepKey];
    if (currentStep && currentStep.no) {
        const nextStepKey = currentStep.no; // Get the "no" field of the current step
        const nextStep = CPR_STEPS[nextStepKey]; // Retrieve the next step
        if (nextStep) {
            stepKey = nextStepKey; // Update the stepKey
            this.animationCButtonText.text = nextStep.noLabel; // Update the button text
            this.animationAButtonText.text = nextStep.yesLabel; // Update the button text
            this.flightPathText.text = nextStep.text; // Update the text to the new step's text
        } else {
            this.flightPathText.text = "No further steps available.";
        }
    } else {
        this.flightPathText.text = "No further steps available.";
    }
  }

  private subscribeToCurrentLaunchAnimationEndEvent = (): void => {
    let currentAnimationClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName);
    let flightEndTimestamp = currentAnimationClip.duration;
    currentAnimationClip.animation.createEvent("flightEnded", flightEndTimestamp);
  }
}