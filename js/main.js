$(document).ready(function() {

    function drawTable(wordcount) {
        $("#word-holder").empty()
        $.each(wordcount, function(index, value) {
            tag = '<tr><td id="' + index + '">' + index + '</td><td id="' + index + '-count">' + value + '</td></tr>'
            $("#word-holder").append(tag);
        });
    }

    function reportIllegalWords(words) {
        $('#illegal-words').empty()
        $.each(words, function(index, value) {
            $('#illegal-words').append("<p>" + value + "</p>")
        });
    }

    function updateCounts(wordlist, wordcount) {
        var illegalWords = []
        var wordsAndCounts = {}
        var legalWords = []

        $.each(wordlist, function(index, value) {
            if (wordcount[value] == undefined) {
                illegalWords.push(value)
            } else {
                legalWords.push(value)
                
                if (wordsAndCounts[value] == undefined) {
                    wordsAndCounts[value] = wordcount[value] - 1;
                } else {
                    wordsAndCounts[value] = wordsAndCounts[value] - 1;
                }
                
            }
        });
        
        if (illegalWords.length > 0) {
            reportIllegalWords(illegalWords)
        } else {
            $('#illegal-words').empty()
        }
        
        updateExistingTable(wordsAndCounts)
        return legalWords
    }

    function updateExistingTable(wordsAndCounts) {
        $.each(wordsAndCounts, function(index, value) {
            id = '#' + index + '-count'
            $(id).html(value)

            if (value < 1) {
               $(id).parent('tr').addClass('no-more') 
            } else {
               $(id).parent('tr').removeClass('no-more') 
            }
        });
    }

    function gatherList() {
        rawtext = $('#WORDS').val()
        rawtext = rawtext.toLowerCase()

        // Remove various punctuation marks
        rawtext = rawtext.replace(/[^\w\s]|_/g, '')
        retlist = rawtext.match(/\S+/g)

        if (retlist == null) {
            alert('You need to enter some text!')
            drawTable(getWordCount());
            return false
        } else {
            return retlist
        }
    }

    function resetWordCount(word) {
        originalWordCounts = getWordCount()
        id = '#' + word + '-count'
        $(id).html(originalWordCounts[word])
        $(id).parent('tr').removeClass('no-more') 
    }

    var changedCounts = [];
    $('#report').click(function() {
        if (changedCounts.length == 0) {
            changedCounts = updateCounts(gatherList(), getWordCount())
        } else {
            // Update word counts and reset any words used in previous run, but *not* in this run
            previousWords = new Set(changedCounts);

            changedCounts = updateCounts(gatherList(), getWordCount())
            changedWords = new Set(changedCounts)

            previousWords.forEach(function(i) {
                if (changedWords.has(i) == false) {
                    resetWordCount(i)
                }
            });
        }
    });

    // Filter table results
    // Code from: https://jsfiddle.net/tXNQd/122/
    // Relevant SO item: https://stackoverflow.com/questions/17074687/filtering-table-rows-using-jquery
    $("#searchInput").keyup(function () {
        var rows = $("#word-holder").find("tr").hide();
        if (this.value.length) {
            var data = this.value.split(" ");
            $.each(data, function (i, v) {
                rows.filter(":contains('" + v + "')").show();
            });
        } else rows.show();
    }); 

    $('#filter-out-zero-or-fewer-results').change(function() {
        if ($('#filter-out-zero-or-fewer-results').prop('checked') == true) {
            $('.no-more').addClass('do-not-display')
        } else {
            $('.no-more').removeClass('do-not-display')
        }
    });

    // Draw the table upon initial page load
    drawTable(getWordCount());

    // By default, set the "Exclude used words?" box to unchecked
    $('#filter-out-zero-or-fewer-results').attr('checked', false) 

});
