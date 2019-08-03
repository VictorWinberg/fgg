\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{fgg}

\LoadClass[11pt]{article}

\RequirePackage[quiet]{fontspec}
\RequirePackage{parskip}
\RequirePackage{graphicx}
\RequirePackage{fancyhdr}
\RequirePackage[swedish]{babel}
\RequirePackage[unicode]{hyperref}
\RequirePackage[includeheadfoot, top=2.0cm, bottom=4cm]{geometry}
\RequirePackage{xparse}
\RequirePackage{etoolbox}
\RequirePackage{pdfpages}
\RequirePackage{tocloft}
\RequirePackage{calc}
\RequirePackage{ifthen}
\RequirePackage{longtable}
\RequirePackage{array}
\RequirePackage{nameref}
\RequirePackage{datetime}

\AtBeginDocument{
  \hypersetup{
    pdftitle = {\@title},
    pdfauthor = {\@author},
    citecolor=black,
    filecolor=black,
    linkcolor=black,
    urlcolor=black
  }
}

\DeclareDocumentCommand \subtitle {m} {%
  \DeclareDocumentCommand \@subtitle {}{#1}
}
\DeclareDocumentCommand \datum {m} {%
  \DeclareDocumentCommand \@datum {}{#1}
}
\DeclareDocumentCommand \plats {m} {%
  \DeclareDocumentCommand \@plats {}{#1}
}

\renewcommand{\thesection}{\S\arabic{section}.}
\renewcommand{\dateseparator}{}

% Set up headers

\DeclareDocumentCommand \makehf {}{%
  \pagestyle{fancy}
  \fancyhf{}

  \newcommand{\headleft}{%
    \raisebox{-3mm}{\includegraphics[width=16mm]{FGG}}\hspace{1mm}
    \parbox[b]{10cm}{%
      \textbf{Fina Grabbarnas Grupp}\\
      FGG Original\\
      \@title
    }
  }
  \newcommand{\headright}{%
    Sida \thepage\\\
    \yymmdddate\@date
  }

  % Calculate header height
  \settototalheight\headheight{\headleft}
  \addtolength\headheight{1.0pt}

  \lhead{\headleft}
  \rhead{\headright}

  \renewcommand{\headrule}{
    \nointerlineskip
    \hskip 16mm\hrulefill
  }

  \renewcommand{\footrulewidth}{\headrulewidth}

  \lfoot{%
    \flushleft Fina Grabbarnas Grupp\\
      FGG HQ\\
      Malmö
  }

  \rfoot{%
    \begin{flushright}
      \href{mailto:fgg@gmail.com}{fgg@gmail.com}\\
      \href{http://fgg.ml}{www.fgg.ml}
    \end{flushright}
  }
}

\DeclareDocumentCommand \maketitle {} {%
  {\centering \bf{\LARGE{\@title\ \yymmdddate\@date}}\par}
  \ifdef{\@subtitle}{{\centering\Large \@subtitle\par}}{}
  \@datum\\
  Plats: \@plats
}

\def\shortyear#1{\csname @gobbletwo\expandafter\endcsname\number#1}
\newdateformat{yymmdddate}{%
\shortyear{\THEYEAR}\twodigit{\THEMONTH}\twodigit{\THEDAY}}


\newcommand{\paragraf@tocdepth}{}
\newcommand{\protokoll@envname}{}
\DeclareOption{protokoll}{%
  \renewcommand{\paragraf@tocdepth}{1}
  \renewcommand{\protokoll@envname}{protokoll}}
\ExecuteOptions{protokoll}
\ProcessOptions

\newlength{\numbercollength}
\newlength{\subjectcollength}
\setlength{\numbercollength}{11mm}
\setlength{\subjectcollength}{38mm}
\newlength{\paragraf@extraskip}
\newenvironment{\protokoll@envname}{%
  \setlength{\paragraf@extraskip}{0mm}
  \begin{list}{}{%
      \newcommand{\parnumber}{}%
      \setlength{\labelwidth}{\numbercollength + \subjectcollength}%
      \setlength{\leftmargin}{\labelwidth + \labelsep}%
      \renewcommand{\makelabel}[1]{%
        \ifpdf
          \pdfbookmark[\paragraf@tocdepth]{%
            \S\parnumber{} ##1}{par:\parnumber}%
          \hypertarget{par:\parnumber}{}%
        \fi
        \ifpdf
          \phantomsection
        \fi
        \renewcommand{\@currentlabelname}{##1}%
        \label{par:\parnumber}%
        \raisebox{0pt}[1ex][0pt]{%
          \makebox[\labelwidth][l]{%
            \parbox[t]{\numbercollength}{\S\parnumber}%
            \parbox[t]{\subjectcollength}{%
              \raggedright\hspace{0pt}##1}}}\hfill}%
      \newcommand{\paragraf}[3][0]{%
        \vspace{\the\paragraf@extraskip}%
        \setlength{\paragraf@extraskip}{##1\baselineskip}%
        \renewcommand{\parnumber}{##2}%
        \item[##3]}}}{%
    \vspace{\the\paragraf@extraskip}%
  \end{list}}
\newenvironment{narvaro}{%
  \newcommand{\narvaro@caption}{Närvarande:}%
  \newcommand{\person}[3][]{%
    \narvaro@caption &
    \ifthenelse{\equal{##1}{}}{##2}{\personakt{##2}{##1}} & ##3 \\
    \renewcommand{\narvaro@caption}{}}%
  \begin{longtable}[l]{@{}lll}}{%
  \end{longtable}}

\newlength{\signaturetopskip}
\setlength{\signaturetopskip}{\baselineskip}
\newlength{\signaturebottomskip}
\setlength{\signaturebottomskip}{\baselineskip}
\newlength{\signaturewidth}
\newlength{\signatureheight}
\setlength{\signatureheight}{15mm}
\newlength{\signaturehorizskip}
\setlength{\signaturehorizskip}{13mm}
\newlength{\temp@sigwidth}%
\newcommand{\signature}[4][]{%
  \vspace{\signaturetopskip}%
    \ifthenelse{\equal{#1}{}}{%
      \settowidth{\signaturewidth}{#2~}%
      \settowidth{\temp@sigwidth}{#3~}%
      \ifthenelse{\lengthtest{\temp@sigwidth>\signaturewidth}}{%
        \setlength{\signaturewidth}{\temp@sigwidth}}{}%
      \settowidth{\temp@sigwidth}{#4~}%
      \ifthenelse{\lengthtest{\temp@sigwidth>\signaturewidth}}{%
        \setlength{\signaturewidth}{\temp@sigwidth}}{}}{%
      \setlength{\signaturewidth}{#1}}%
    \parbox[t]{\signaturewidth}{%
      \raggedright #2~\vspace{\signatureheight}\\%
      #3~\\%
      #4~}%
    \hspace{\signaturehorizskip}%
    \vspace{\signaturetopskip}%
}


\endinput
