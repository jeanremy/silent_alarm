(function() {
    /*****************************
        Variables declarations
    ******************************/

    var $start       = $('#start'),
        $form        = $('#form-timer'), 
        $history     = $('#past-tasks');



    /**************************
        Record object
    **************************/
    function Record(number, title, time){
        this.number         = number;
        this.title          = title;
        this.time           = time;
        this.timestamp      = new Date();
    };
    Record.prototype.changeTitle = function(newTitle) {
        this.title = newTitle;
        this.store(this.number, this.title, this.time);
    };
    Record.prototype.display = function() {
        var time =  this.displayTime(),
            line = '<div class="item clearfix" data-storage="item_'+this.number+'">'+time+'<div class="delete icon-cross"></div><div class="edit icon-pencil"></div><textarea class="item-title" disabled="disabled">'+this.title+'</textarea></div>';
        $history.prepend(line);
    };
    Record.prototype.store = function() {
        var key     = 'item_'+this.number,
            val     = JSON.stringify(this);
        //console.log(val);
        localStorage.setItem(key, val);
    };
    Record.prototype.displayTime = function() {
        var hour        = Math.floor(this.time / 3600),
            minute      = Math.floor((this.time - (hour * 3600)) / 60),
            second      = Math.floor(this.time - (hour * 3600) - (minute * 60));

        hour    += 'h';
        minute  += 'm';
        second  += 's';

        return '<div class="item-time"><div class="hour">'+hour+'</div><div class="minutes">'+minute+'</div><div class="seconds">'+second+'</div></div>';
    };
    Record.prototype.deleteItem = function() {
        localStorage.removeItem('item_'+this.number);
    }

    /**************************
        Timer
    **************************/
    var timer = {

        total: 0,
        count: null,
        hours: $('#hours'),
        minutes: $('#minutes'),
        seconds: $('#seconds'),
        title: $('#title'),
        itemNumber: 0,
        records: {},


        init: function() {
            if(Modernizr.localstorage) {
                if(localStorage.length != 0) {

                    for (var id in localStorage) {
                        var item        = JSON.parse(localStorage[id]);
                        this.itemNumber = item.number + 1; // to avoid duplication of item

                        /* Records all timers as object Record in an attribute */
                        this.records[id] = new Record(item.number, item.title, item.time);
                        this.records[id].display();
                        console.log(this.itemNumber);
                    }
                }

            } else {
                alert('Votre navigateur est trop ancien. Vous devez le mettre à jour');
            }
        },

        setTime: function(hour, min, sec) {
            timer.hours.text(hour);
            timer.minutes.text(min);
            timer.seconds.text(sec);
        },

        launch: function() {
            (function count(){
                var hour        = Math.floor(timer.total / 3600),
                    minute      = Math.floor((timer.total - (hour * 3600)) / 60),
                    second      = Math.floor(timer.total - (hour * 3600) - (minute * 60));

                timer.total++;

                hour    = (hour < 10)? '0'+ hour:hour;
                minute  = (minute < 10)? '0'+ minute:minute;
                second  = (second < 10)? '0'+ second:second;


                timer.setTime(hour, minute, second);
                timer.count = setTimeout(function(){count();}, 1000);
            })();
                
        },

        save: function() {
            clearTimeout(this.count);
            var title           = this.title.val(),
                id              = 'item_'+this.itemNumber;
            console.log(this.itemNumber);
            
            // create a new Record, display and save it
            this.records[id] = new Record(this.itemNumber, title, this.total);
            this.records[id].display();
            this.records[id].store();
            //console.log(this.records);

            // Reset form et inc ItemNumber
            timer.setTime('00', '00', '00');
            this.title.val('');
            this.itemNumber++;
        }
    };

    //localStorage.clear();
    timer.init();

    /*****************************
        Listener on form submit
    *****************************/
    $form.on('submit', function(e) {
        e.preventDefault();
        if($start.hasClass('start')) {
            $start.attr('class', 'stop').val('Stop');
            timer.launch();
        } else {
            $start.attr('class', 'start').val('Start');
            timer.save(); 
        }
        return false;
    });

    /****************************
        UI rules
    ****************************/
    $('#expand').on('click', function() {
        $(this).toggleClass('close');
        $('.sidebar').toggleClass('active');
    });

    $(document).on('click', '.edit', function() {
        var $this = $(this),
            item  = $this.parent().attr('data-storage');

        if($this.hasClass('active')) {
            $this.removeClass('active');
            $this.siblings('.item-title').attr('disabled', 'disabled');
            console.log(item);
            timer.records[item].changeTitle($this.siblings('.item-title').val());

        } else {
            $this.addClass('active');
            $this.siblings('.item-title').removeAttr('disabled');
        }
    });

    $(document).on('click', '.delete', function() {
        var $this   = $(this),
            item    = $this.parent().attr('data-storage');
        $this.parent().fadeOut(200).remove();
        timer.records[item].deleteItem();
    });

   
    
    
})();