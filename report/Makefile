MAIN = report
TEX = $(MAIN).tex
BIB = references.bib

IMAGES = images/EndScreen.png images/HomeScreen.png images/Ingame.png


all: $(MAIN).pdf

$(MAIN).pdf: $(TEX) $(BIB) $(IMAGES)
	pdflatex $(MAIN)
	bibtex $(MAIN)
	pdflatex $(MAIN)
	pdflatex $(MAIN)


clean:
	rm -f *.aux *.bbl *.blg *.log *.out *.toc

.PHONY: clean