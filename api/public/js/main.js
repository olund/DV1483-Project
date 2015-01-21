$(document).ready(function($) {
    'use strict';


    var myGram = {
        limit : 0,
        perPage : 10,
        startLoadPos: 2000,
        current : 0,

        init : function(config) {
            this.config = config;

            var timerId,
                csrftoken = this.getCookie('csrftoken'),
                self = this,
                holder  = $('#dropzone'),
                state   = $('state'),
                doc     = $(document);

            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!self.csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            /* Removes default behavior for document
             * on drop event and drag
            */
            doc.on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            doc.on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            doc.on('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            // User dont support the upload function
            if (typeof window.FileReader === 'undefined') {
                state.html('DU SUGER SOM INTE HAR SHIT');
            }

            holder.on('dragenter', function(event) {
                event.stopPropagation();
                event.preventDefault();
                holder.addClass('hover');
                return false;
            });

            holder.on('dragleave', function(event) {
                event.stopPropagation();
                event.preventDefault();
                holder.removeClass('hover');
                return false;
            });

            // This is also the upload event
            holder.on('drop', function(e) {
                e.stopPropagation();
                e.preventDefault();
                holder.removeClass('hover');
                var file     = e.originalEvent.dataTransfer.files[0],
                    formData = new FormData();

                formData.append('file', file);
                $.ajax({
                    type: "POST",
                    url: '/api/',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success : function() {
                        console.log('Successfully sent :');
                        console.log(file);
                        state.html('Successfully uploaded file')
                    },
                    error : function() {
                        console.log('Failed');
                    }

                });



                return false;
             });


            $('#uploadForm').submit(function() {
                self.status('Uploading the file ...');

                $(this).ajaxSubmit({
                    error: function(xhr) {
                        self.status('Error: ' + xhr.status);
                    },

                    success: function(response) {
                        if(response.error) {
                            self.status('Opps, something bad happened');
                            return;
                        }

                        var imageUrlOnServer = response.path;
                        self.status('Success, file uploaded to:' + imageUrlOnServer);
                        $('#uploadForm').trigger("reset");
                    }
                });

                // Have to stop the form from submitting and causing
                // a page refresh - don't forget
                return false;
            });
            // Check to see when a user has selected a file
            timerId = setInterval(function() {
                if($('#userPhotoInput').val() !== '') {
                    clearInterval(timerId);
                    $('#uploadForm').submit();
                }
            }, 500);


            $(window).scroll(function(){
                var w   = $(window),
                    doc = $(document);
                if (w.scrollTop() == doc.height()-w.height()){
                    self.refresh(10, 10);
                }
            });
        },

        refresh: function (limit, perPage) {
            console.log("Trigged! limit: " + limit);
            this.limit = this.limit + parseInt(limit);
            this.perPage = this.perPage + parseInt(perPage);

            $.ajax({
                url: '/api/' + limit + '/' + perPage,
                type: 'GET',
                Type: 'json',
            })
            .done(function(data) {
                $.each(data, function(i, data) {
                    var ele = $('<div>', {'class': 'timeline-container'}).hide().append(
                        $('<div>', {'class': 'timeline-left col-md-4'}).append(
                            $('<p>', {text: data.time})
                        )
                        .append($('<p>', {'class': 'timeline-user', 'text': data.username}))
                    )
                    .append(
                        $('<div>', {'class': 'timeline-right col-md-8'}).append(
                            $('<div>', {'class': 'timeline-inner'}).append(
                                    $('<img>').attr('src', data.img)
                                    .addClass('timeline-img')
                                )
                        )
                    ).fadeIn(1500)
                    $('#timeline').append(ele);

                });
            })
            .fail(function() {
                $('#timeline').text('Failed to load files');
                console.log("error");
            });
        },

        status :  function(message) {
            console.log(message);
            $('#status').text(message);
        },

        //Ajax call
        csrfSafeMethod: function (method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        },

        getCookie: function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }

    myGram.init();
    myGram.refresh();
    myGram.refresh(10, 10);
});


