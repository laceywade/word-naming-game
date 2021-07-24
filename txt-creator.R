### This script takes a results file outputted from the "Word Naming Game" in PCIbex and creates separate text files
### for each recording to be used with the collected soundfiles for forced alignment with FAVE-align

library(stringr)

### Load in the "Cleaned_Results_date.csv" file from Ibex
ibex.full<-read.csv(file.choose(), header=T)
### Keep only lines with filenames
ibex<-ibex.full[ibex.full$Parameter=="Filename",]
### Create filenames
ibex$files<-str_replace(ibex$filename, ".webm", ".txt")

### Create tab-delimited transcript files in the working directory
for (row in 1:nrow(ibex)) {
  file <- paste(ibex[row, "files"])
  id <- paste(ibex[row, "id"])
  word <- ibex[row, "word"]
  transcription <- paste("the word is", word)
  contents <- data.frame(cbind(id, "0.1", "100000", transcription))
   write.table(contents, file=file, sep="\t", col.names=FALSE, quote=FALSE)
  }
