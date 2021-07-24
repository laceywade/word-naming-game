PennController.ResetPrefix(null);

PennController.InitiateRecorder("https://my.server/myExperiment/myFile.php").label("initiate")

PennController.DebugOff() 

PennController.Sequence("check", "initiate", "tone", "recorder",
 "instr1", randomize("baseline"), 
 "instr2", randomize("exposure"),
 "instr3", randomize("post"), 
 "send", "final")


//Play a sample tone to test that headphones are working
PennController("tone",					
	newText("Click the button to play the tone. Please adjust your headphones to ensure you can hear the tone clearly. Press continue when you are ready.")
		.settings.center()
		.print()
	,
	newButton("Play Sound")
    		.settings.center()
		.print()
    		.wait()
	,
	newAudio("tone", "tones.wav")
		.play()
		.wait()
	,
	newButton("Continue")
		.settings.center()
		.print()
		.wait()
	,
	getAudio("tone")
    		.stop()

)


//Initiate the recorder and make a sample recording to check microphone
PennController("recorder",					
	newText("Click the RECORD button to make a sample recording of yourself saying a few words. Click again to stop the recording. Then press PLAY to listen to your recording.")
		.print()
	,
	    newText("blank1", ".")
      .settings.color("white")
      .print()
   ,
	newText("Make sure you can hear yourself clearly. Make any adjustments to your position/environment/microphone, then click CONTINUE when you are ready to begin.")
		.print()
	,
newVoiceRecorder("testrecorder")
.settings.center()
	.print()
	.wait()

,
newButton("Continue")
		.settings.center()
		.print()
		// Do not let participant continue until they make a sample recording and listen to it
		.wait(getMediaRecorder("testrecorder").test.hasPlayed())

)



PennController("instr1",
    newText("instr1a", "You will be playing a game today. We will try to get you to guess a single word by giving clues. The clues can be very specific but cannot contain the word itself. You will guess the word being described by naming it out loud. To record your response press the 'Record' button. When you are finished, click 'Next' to continue onto the next clue, and your response will be saved automatically.")
     .print()
   ,
    newText("blank1", ".")
      .settings.color("white")
      .print()
   ,
    newText("instr1c", "An important note: When you give your response, please say it in the phrase 'The word is ____.'")
      .settings.bold()     
      .print()
   ,
        newText("blank2", ".")
      .settings.color("white")
      .print()
   ,
    newText("instr1d", "For instance, if the clue is 'This is a household pet that often meows', you would respond by saying 'The word is cat.'")     
      .print()
   ,
    newText("blank3", ".")
       .settings.color("white")
       .print()
   ,
    newButton("next", "Click here to continue")
       .settings.center()
       .print()
       .wait()
)



//Baseline phase has written clues to collect participants' baseline productions prior to exposure to the model talker
PennController.Template( PennController.defaultTable.filter("Label", "baseline"),
row=> PennController("baseline",
	newVar("TrialN", 0)
	.settings.global()
	.set(v => v+1)
,
    newText("instruction", "Record your response out loud by pressing the 'Record' button. Press 'Next' when you are finished. Remember to state your answer in the phrase 'The word is ____.'")   
        .print()
   ,
    newText("blank1", ".")
        .settings.color("white")
        .print()
   ,
    newText("myclues", row.clue)
         .settings.center()
         .settings.bold()
         .print()               
   ,                    
    newText("blank2", ".")
          .settings.color("white")
          .print()
   ,
    newText("hint", "hint: " + row.hint)
          .settings.center()
          .print()
   ,
    newText("blank3", ".")
          .settings.color("white")
          .print()
   ,
       
    newButton("recordbutton", "Record")
         .settings.center()
         .settings.color("white")
         .settings.css("background", "red")
         .settings.size(100, 40)
         .print()
         .wait()
    ,
    //Save recording as ParticipantID_Item
    newVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
        .record()
,
    newText("blank", ".")
            .settings.color("white")
            .print()
         
   ,
    newButton("next1", "Next")
            .settings.center()
            .settings.size(100, 40)
            .print()
            .wait()
   ,
// Wait to stop recorder because participants often press the 'NEXT' button before they are finished responding
newTimer("delay", 500)
    .start()
    .wait()
,
    getVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
            .stop()
            //.settings.log()
    
    ,
    
        newTimer("wait", 100)
        .start()
        .wait()
)
 .log("group" , row.Group)
 .log("label" , row.Label)
 .log("list" , row.list)
 .log("word" , row.word)
 .log("vowel" , row.vowel)
 .log("voice" , row.voice)
 .log("condition", row.Condition)
 .log("soundfile" , row.soundfile)
 .log("stimType" , row.stimType)
.log("urlID", PennController.GetURLParameter("id"))
.log( "TrialN", getVar("TrialN") )
)



PennController("instr2",

	newText("Please make sure your headphones are on. Click to play instructions.")
		.settings.center()
		.print()
	,
  newButton("play", "Play instructions")
      .print()
      .wait()
,					
	newAudio("instr", "instr.wav")
		.play()
		.wait()
	,
  newButton("continue", "Click here to continue")
      .print()
      .wait()
)



//Exposure condition uses auditory clues as exposure
PennController.Template( PennController.defaultTable.filter("Label", "exposure"),
row=> PennController("exposure",
	newVar("TrialN", 0)
	.settings.global()
	.set(v => v+1)
,
    newText("instruction", "Record your response out loud by pressing the 'Record' button. Press 'Next' when you are finished. Remember to state your answer in the phrase 'The word is ____.'")   
        .print()
   ,
    newText("blank1", ".")
        .settings.color("white")
        .print()
   ,
    newText("hint", "hint: " + row.hint)
          .settings.center()
          .print()
   ,
    newText("blank3", ".")
          .settings.color("white")
          .print()
   ,

	newAudio("audioclue", row.soundfile)
		.play()
		.wait()
	,
       

    newButton("recordbutton", "Record")
         .settings.center()
         .settings.color("white")
         .settings.css("background", "red")
         .settings.size(100, 40)
         .print()
         .wait()
    ,
    
    newVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
	.settings.log()
        .record()
,
    newText("blank1", ".")
            .settings.color("white")
            .print()
         
   ,
    newButton("next1", "Next")
            .settings.center()
            .settings.size(100, 40)
            .print()
            .wait()
   ,

newTimer("delay", 500)
    .start()
    .wait()
,
    getVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
            .stop()
            //.settings.log()
    
    ,
    
        newTimer("wait", 100)
        .start()
        .wait()
)
 .log("group" , row.Group)
 .log("label" , row.Label)
 .log("list" , row.list)
 .log("word" , row.word)
 .log("vowel" , row.vowel)
 .log("voice" , row.voice)
 .log("condition", row.Condition)
 .log("soundfile" , row.soundfile)
 .log("stimType" , row.stimType)
.log("urlID", PennController.GetURLParameter("id"))
.log( "TrialN", getVar("TrialN") )
)



PennController("instr3",
    newText("instr3", "You are doing great! We are almost finished. For the last round, we will go back to presenting the clues in written format. The instructions are the same. Remember to respond out loud by saying 'The word is ____.'")
         .print()
   ,
    newButton("next", "Click here to continue")
         .settings.center()
         .print()
         .wait()
)



//post-exposure condition uses written clues to assess how long exposure effects last post-exposure
PennController.Template( PennController.defaultTable.filter("Label", "post"),
row=> PennController("post",
	newVar("TrialN", 0)
	.settings.global()
	.set(v => v+1)
,
    newText("instruction", "Record your response out loud by pressing the 'Record' button. Press 'Next' when you are finished. Remember to state your answer in the phrase 'The word is ____.'")   
        .print()
   ,
    newText("blank1", ".")
        .settings.color("white")
        .print()
   ,
    newText("myclues", row.clue)
         .settings.center()
         .settings.bold()
         .print()               
   ,                    
    newText("blank2", ".")
          .settings.color("white")
          .print()
   ,
    newText("hint", "hint: " + row.hint)
          .settings.center()
          .print()
   ,
    newText("blank3", ".")
          .settings.color("white")
          .print()
   ,
       

    newButton("recordbutton", "Record")
         .settings.center()
         .settings.color("white")
         .settings.css("background", "red")
         .settings.size(100, 40)
         .print()
         .wait()
    ,
    
    newVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
        .record()
,
    newText("blank4", ".")
            .settings.color("white")
            .print()
         
   ,
    newButton("next1", "Next")
            .settings.center()
            .settings.size(100, 40)
            .print()
            .wait()
   ,

newTimer("delay", 500)
    .start()
    .wait()
,
    getVoiceRecorder(PennController.GetURLParameter("id")+ "_" +row.word)
            .stop()
            //.settings.log()
    
    ,
    
        newTimer("wait", 100)
        .start()
        .wait()
)
 .log("group" , row.Group)
 .log("label" , row.Label)
 .log("list" , row.list)
 .log("word" , row.word)
 .log("vowel" , row.vowel)
 .log("voice" , row.voice)
 .log("condition", row.Condition)
 .log("soundfile" , row.soundfile)
 .log("stimType" , row.stimType)
.log("urlID", PennController.GetURLParameter("id"))
.log( "TrialN", getVar("TrialN") )
)

PennController.SendResults("send")


PennController("final",

     newText("link", "<p><a href='https://google.com'>"+
                    "Click here to continue.</a></p>")
        .settings.css({"font-weight": "bold", "font-size": "1.5em", "font-family": "sans-serif"})
        .settings.center()
        .print()         
     ,
     newTimer("dummy", 10)
         .wait()
)