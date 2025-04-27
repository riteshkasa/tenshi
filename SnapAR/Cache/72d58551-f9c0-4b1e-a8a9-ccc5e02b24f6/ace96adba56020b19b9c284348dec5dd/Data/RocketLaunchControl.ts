// CPRGuideControl.ts – Interactive CPR decision‑tree GUI with **audio playback**
// -----------------------------------------------------------------------------------------
// NEW: Each step can now specify an `audio` field (name of an MP3 in the Resources panel).
//      When the step is shown, that track is loaded at runtime and played through a single
//      `@input` AudioComponent (assigned in the Inspector). Any currently‑playing sound is
//      stopped before the new one starts.
// -----------------------------------------------------------------------------------------

import { Interactable } from "../../../Components/Interaction/Interactable/Interactable";
import { validate } from "../../../Utils/validate";

// Lens Studio exposes a global Assets object (not typed by default)
declare const Assets: {
  get(name: string): Texture | AudioTrackAsset | undefined;
};

// --------- CPR‑STEP DATA STRUCTURE ---------------------------------------------------------
interface CprStep {
  text: string;
  image?: string;  // Texture / GIF resource name
  audio?: string;  // **NEW** – AudioTrack resource name (e.g. MP3)
  yes?: string;
  no?: string;
  yesLabel: string;
  noLabel: string;
}

// --------- DECISION‑TREE DEFINITION (add / swap `audio` names as needed) -------------------
const CPR_STEPS: Record<string, CprStep> = {
  Start: {
    text: "Is the person breathing?",
    image: "img_breathing_check",
    audio: "aud_breathing_check",
    yesLabel: "Yes",
    noLabel: "No",
    yes: "BreathingRecoveryPos",
    no: "NoBreathingCheckPulse",
  },
  BreathingRecoveryPos: {
    text:
      "Place the person in the recovery\n position and\n monitor breathing. Emergency\n services contacted?",
    image: "img_recovery_position",
    audio: "aud_recovery_position",
    yesLabel: "Yes",
    noLabel: "No",
    yes: "End",
    no: "CallEmergencyServices",
  },
  CallEmergencyServices: {
    text: "Call emergency services \nimmediately. \nStay with the person.",
    image: "img_call_emergency",
    audio: "aud_call_emergency",
    yesLabel: "Done",
    noLabel: "Can't Call",
    yes: "End",
    no: "SignalForHelp",
  },
  SignalForHelp: {
    text: "Shout loudly for help \nand flag down others.",
    image: "img_signal_help",
    audio: "aud_signal_help",
    yesLabel: "Someone\n coming",
    noLabel: "No one\n nearby",
    yes: "End",
    no: "StayAndMonitor",
  },
  StayAndMonitor: {
    text:
      "Stay with the person and\n monitor breathing until\n help arrives.",
    image: "img_monitor",
    audio: "aud_stay_monitor",
    yesLabel: "Stops\n breathing",
    noLabel: "Still\n breathing",
    yes: "NoBreathingCheckPulse",
    no: "End",
  },
  NoBreathingCheckPulse: {
    text: "Do they have a pulse?",
    image: "img_check_pulse",
    audio: "aud_check_pulse",
    yesLabel: "Yes",
    noLabel: "No",
    yes: "RescueBreathsOnly",
    no: "StartChestCompressions",
  },
  RescueBreathsOnly: {
    text:
      "Give 1 breath every 5–6 \nseconds. Emergency \nservices contacted?",
    image: "img_rescue_breaths",
    audio: "aud_rescue_breaths",
    yesLabel: "Yes",
    noLabel: "No",
    yes: "ContinueRescueBreaths",
    no: "CallEmergencyServices",
  },
  ContinueRescueBreaths: {
    text:
      "Continue rescue breaths \nuntil help arrives or \ncondition changes.",
    image: "img_rescue_breaths",
    audio: "aud_continue_breaths",
    yesLabel: "Person\n recovers",
    noLabel: "No \nchange",
    yes: "RecoveryPosition",
    no: "ContinueRescueBreaths",
  },
  StartChestCompressions: {
    text:
      "Start chest compressions: 30 \ncompressions, \n2 rescue breaths.",
    image: "img_chest_compressions",
    audio: "aud_chest_compressions",
    yesLabel: "Continue",
    noLabel: "Help\n arrived",
    yes: "ContinueCprCycles",
    no: "End",
  },
  ContinueCprCycles: {
    text:
      "Keep doing cycles of 30 \ncompressions and 2 breaths.",
    image: "img_cpr_cycles",
    audio: "aud_cpr_cycles",
    yesLabel: "Person\n recovers",
    noLabel: "No \nchange",
    yes: "RecoveryPosition",
    no: "ContinueCprCycles",
  },
  RecoveryPosition: {
    text: "Place in recovery position and\n monitor breathing.",
    image: "img_recovery_position",
    audio: "aud_recovery_position",
    yesLabel: "Breathing\n normal",
    noLabel: "Breathing\n stops",
    yes: "End",
    no: "StartChestCompressions",
  },
  End: {
    text: "Stay with the person. Help is \non the way.",
    image: "img_wait_help",
    audio: "aud_end",
    yesLabel: "",
    noLabel: "",
    yes: "End",
    no: "End",
  },
};

export type StepKey = keyof typeof CPR_STEPS;

// --------- COMPONENT IMPLEMENTATION --------------------------------------------------------
@component
export class CPRGuideControl extends BaseScriptComponent {
  


  // Inspector inputs -------------------------------------------------------------
  @input yesButton!: SceneObject;
  @input noButton!: SceneObject;
  @input messageText!: Text;
  @input displayGraphic!: Image;
  /** Single reusable AudioComponent that will play the step's MP3 */
  @input audioPlayer1!: AudioComponent;
  @input audioPlayer2!: AudioComponent;
  @input audioPlayer3!: AudioComponent;

  // Internal state ---------------------------------------------------------------
  private yesInteractable: Interactable | null = null;
  private noInteractable: Interactable | null = null;
  private currentStepKey: StepKey = "Start";

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.onStart());
  }

  private onStart(): void {
    // Cache interactables
    this.yesInteractable = this.yesButton.getComponent(Interactable.getTypeName());
    this.noInteractable = this.noButton.getComponent(Interactable.getTypeName());
    validate(this.yesInteractable);
    validate(this.noInteractable);

    // Bind triggers
    this.yesInteractable!.onTriggerEnd.add(this.onYesPressed);
    this.noInteractable!.onTriggerEnd.add(this.onNoPressed);

    // Show first step
    this.showStep(this.currentStepKey);
  }

  // ---------------- Button handlers --------------------------------------------
  private onYesPressed = (): void => {
    const next = CPR_STEPS[this.currentStepKey].yes as StepKey | undefined;
    if (next) {
      this.showStep(next);
    }
  };

  private onNoPressed = (): void => {
    const next = CPR_STEPS[this.currentStepKey].no as StepKey | undefined;
    if (next) {
      this.showStep(next);
    }
  };

  // ---------------- Core display & audio logic ---------------------------------
  private showStep(key: StepKey): void {
    this.currentStepKey = key;
    const step = CPR_STEPS[key];

    // Update text
    this.messageText.text = step.text;

    // Update graphic
    // if (step.image) {
    //   const tex = Assets.get(step.image) as Texture | undefined;
    //   if (tex) {
    //     this.displayGraphic.enabled = true;
    //     this.displayGraphic.mainMaterial.mainPass.baseTex = tex;
    //   } else {
    //     this.displayGraphic.enabled = false;
    //   }
    // } else {
    //   this.displayGraphic.enabled = false;
    // }

    // Update button labels & visibility
    this.setButtonLabel(this.yesButton, step.yesLabel);
    this.setButtonLabel(this.noButton, step.noLabel);
    this.yesButton.enabled = Boolean(step.yes);
    this.noButton.enabled = Boolean(step.no);

    // Play step‑specific audio (if provided)
    this.playAudioForStep(step);
  }

  /** Plays/loops the audio track for the given step */
  private playAudioForStep(step: CprStep): void {
    if (!this.audioPlayer1) return;

    // Stop any track currently playing
    this.audioPlayer1.stop(true);

    if (step.audio && step.audio === "aud_call_emergency") {
      this.audioPlayer1.play(1);
      // const track = Assets.get(step.audio) as AudioTrackAsset | undefined;
      // if (track) {
      //   this.audioPlayer.audioTrack = track;
      //   // 1 loop (play once). Change to -1 to loop indefinitely if desired.
      //   this.audioPlayer.play(1);
      // } else {
      //   print(`CPRGuideControl: missing audio asset '${step.audio}'.`);
      // }
    }
  }

  /** Helper to update the label inside a button SceneObject */
  private setButtonLabel(button: SceneObject, label: string): void {
    const txt = button.getFirstComponent("Component.Text");
    if (txt) {
      (txt as Text).text = label;
    }
  }
}
