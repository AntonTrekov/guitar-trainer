'use strict';

/* Array.shuffle( deep ) - перемешать элементы массива случайным образом
deep - необязательный аргумент логического типа, указывающий на то, 
нужно ли рекурсивно обрабатывать вложенные массивы;
по умолчанию false (не обрабатывать)
*/
Array.prototype.shuffle = function( b ) {
    var i = this.length, j, t;
    while( i ) {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
};

document.addEventListener("DOMContentLoaded", ready);

/*
 * {
 *    string_number: {
 *        fret_number: node
 *    }
 * }
 */
var points = {};

var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

var notesMajor = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

var currentQuizNotes = null;

var strings = 7,
frets = 20;

function ready() {

    document.getElementById('quizReload').addEventListener("click", getQuiz);

    var renderPoints = (function(strings, frets) {
        var outerDiv = document.getElementsByClassName('fret')[0];
        var classNameString, classNameFret;
        for(var i = 1; i <= strings; i++) {
            classNameString = "point point--" + i;
            for(var j = 0; j <= frets; j++) {
                classNameFret = classNameString;
                classNameFret += "-" + j;
                var div = document.createElement('div');
                div.className = classNameFret;
                outerDiv.appendChild(div);
            }
        }
    })(strings, frets);

    var _setPointsCoordinates = (function(strings, frets) {
        var toLeft = 43,
        toBottom = 28,
        className = 'point--',
        classNameString = '',
        classNameFret = '',
        point = '';

        for(var i = 1; i <= strings; i++) {
            // classNameString == 'point--5'
            classNameString = className + i;
            points[i] = {};
            for(var j = 0; j <= frets; j++) {
                // classNameFret == 'point--5-18'
                classNameFret = classNameString + '-' + j;
                point = document.getElementsByClassName(classNameFret)[0];
                points[i][j] = point;
                point.style.left = 34 + (toLeft * j) + 'px';
                if(i > 1) {
                    point.style.top = 5 + (toBottom * (i-1)) + 'px';
                }
            }
        }
    })(strings, frets);

    var _setPointsNotes = (function(strings, frets, points) {
        for(var i = 1; i <= strings; i++) {
            // Position of the first note on the fret
            var pointer = 0;
            switch(i) {
                case 1:
                case 6:
                    pointer = 4;
                    break;
                case 2:
                    pointer = 11;
                    break;
                case 3:
                    pointer = 7;
                    break;
                case 4:
                    pointer = 2;
                    break;
                case 5:
                case 7:
                    pointer = 9;
                    break;
                default:
                    console.log('Error in _setPointsNotes method');
                    break;
            }
            for(var j = 0; j <= frets; j++) {
                points[i][j].innerHTML = notes[pointer];
                if(pointer == 11) {
                    pointer = 0;
                } else {
                    pointer++;
                }
            }
        }
    })(strings, frets, points);

    var initQuiz = (function(event) {
        if(currentQuizNotes == null) {
            var stack = [];
            for (var key in notesMajor) {
                stack[key] = notesMajor[key];
            }
            currentQuizNotes = stack.shuffle();
        }
        getQuiz();
    })();

    function getQuiz(event) {
        var el = document.getElementsByClassName('quiz')[0];
        var note = currentQuizNotes.pop();
        if(typeof note == 'undefined') {
            el.innerHTML = 'Ноты закончились. Чтобы начать заново, <span class=\"quiz-important\">перезагрузите страницу</span>';
        } else {
            el.innerHTML = "Найдите все ноты: <span class=\"quiz-important\">" + note + "</span>";
        }
    };

}
