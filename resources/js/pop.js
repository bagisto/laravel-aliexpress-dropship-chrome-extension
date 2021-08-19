$(document).ready(function () {

    $('#wk-popup-close').click(function () {
        window.close();
    });

    var targetNode = (function () {
        function targetNode(node) {
            this.target = node;
        }
        return targetNode;
    }());

    targetNode.prototype.processCheckbox = function () {
        if ($(this.target).hasClass('active')) {
            this.inactive();
        } else {
            this.active();
        }
        return this;
    };

    targetNode.prototype.functionCheckbox = function () {
        this.filterCheckbox($(this.target).prev('input[type=\'checkbox\']').attr('name'), $(this.target).hasClass('active'));
    };

    targetNode.prototype.filterCheckbox = function (event,event_cond) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'functionCheckbox', event : event, cond : event_cond});
        });
    };

    targetNode.prototype.active = function () {
        $(this.target).prev('input[type=\'checkbox\']').prop('checked', true);
        $(this.target).addClass('active');
    };

    targetNode.prototype.inactive = function () {
        $(this.target).prev('input[type=\'checkbox\']').prop('checked', false);
        $(this.target).removeClass('active');
    };

    $('#wk-option-box .wk-checkbox').click(function () {
        var target = new targetNode(this);
        target.processCheckbox().functionCheckbox();
    });

    $('#wk-clear-localstorage').click(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'clearLocalStorage'}, function (response) {
                if (response['success'] && response['success'] == true) {
                    window.close();
                };
            });
        });
    });

    $(document).delegate('.wk-order-place', 'click', function () {
        var order_id = $(this).data('order-id');

        if (order_id != undefined && order_id != 0) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'orderPlace', order_id: order_id});
            });

            $(this).parent().text('Placed');
        }
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'refreshPopup'}, function (response) {
            if (response.allow_filter) {
                $("#wk-option-box").show();
            }

            if (response.epacket && response.epacket == 'true') {
                $('input[name=\'epacket\']').next('.wk-checkbox').click();
            } else if (!response.epacket || response.epacket != 'false') {
                $('input[name=\'epacket\']').next('.wk-checkbox').click();
            }

            if (response.hide_product_noepacket && response.hide_product_noepacket == 'true') {
                $('input[name=\'hide_product_noepacket\']').next('.wk-checkbox').click();
            }

            if (response.orders) {
                let split = response.orders.split('+');

                $.each(split, function (i, v) {
                    var order = v.split('_');
                    var html = '';
                    html += '<tr>';
                    html += '<td>#' + order[1] + '</td>'
                    html += '<td>' + order[2] + '</td>'

                    if (order[3] == 0) {
                        html += '<td><a class="wk-order-place" data-order-id="' + order[0] + '">Place</a></td>';
                    } else {
                        html += '<td>Placed</td>';
                    }

                    html += '</tr>';

                    $('#wk-order-table tbody').append(html);
                    $('#wk-order-empty').hide();
                    $('#wk-order-table').show();
                });
            }
        });
    });
});
