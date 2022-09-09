(function(){
    function initYandexMap () {
        return new Promise(resolve => {
            if( !window.ymaps ) {
                var script =document.createElement("script");
                // script.src ="https://api-maps.yandex.ru/2.1?apikey={ÐºÐ»ÑŽÑ‡Ð¸Ðº}&lang=ru_RU";
                script.src ="https://api-maps.yandex.ru/2.1?lang=ru_RU";
                script.onload=() => {
                    window.ymaps.ready(() => {
                        resolve();
                    });
                };
                document.body.appendChild(script);
            }
            else
            {
                window.ymaps.ready(() => {
                    resolve();
                });
            }
        });
    }


    function initRecaptcha() {
        if (!window.recaptchaSiteKey) {
            return;
        }
        var script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?render=" + window.recaptchaSiteKey;
        script.onload = () => {
            grecaptcha.ready(() =>
            {
                $("form").on("click", e =>
                {
                    console.log('form_click');
                    var $form =$(e.currentTarget);
                    var $input=$form.find("[name=\"recaptcha_token\"]");
                    var action=$input.data("action-id");
                    if( !$input.val() && !$input.hasClass("recaptcha-processed") )
                    {
                        $input.addClass("recaptcha-processed");
                        grecaptcha.execute(window.recaptchaSiteKey, {
                            action,
                        }).then(token =>
                        {
                            $($input).val(token);
                        });
                    }
                });
            });
        };
        document.body.appendChild(script);
    }

    document.addEventListener('DOMContentLoaded', function(){
        var phone, phoneLinks = document.querySelectorAll('.phone-link[href="#"]');
        for (var i = 0; i < phoneLinks.length; i++) {
            phone = phoneLinks[i].text.replace(/[^\d]/ig, '');
            if (phone.length == 11) {
                if (phone[0] == 7) {
                    phone = '+' + phone;
                }
                phoneLinks[i].href = 'tel:' + phone;
            }
        }

        var
            phoneInputs = document.querySelectorAll('.mask--phone'),
            phoneMask = new Inputmask('+7 (999) 999-99-99');
        for (var i = 0; i < phoneInputs.length; i++) {
            phoneMask.mask(phoneInputs[i]);
        }

        initRecaptcha();

        if (document.querySelector('#contacts-map')) {
            initYandexMap().then(() => {

                ymaps.ready(() => {
                    var map = new ymaps.Map("contacts-map", {
                        center: [55.175096, 61.410660],
                        zoom: 15,
                    });
                    map.controls.add(
                        new ymaps.control.ZoomControl()
                    );
                    map.controls.add('typeSelector');
                    var geoObjects = [];
                    var placemark = new ymaps.Placemark(
                        [55.175096, 61.410660],
                        {
                        },
                        {
                            // iconLayout: 'default#image',
                            // iconImageHref: "/local/templates/.default/src/img/ico-marker.svg",
                            // iconImageSize: [37, 53],
                            // iconImageOffset: [-18, -53]
                        }
                    );
                    geoObjects.push(placemark);
                    map.geoObjects.add(placemark);
                });
                var location = ymaps.geolocation;

                // location.get({
                //     mapStateAutoApply: true
                // })
                //     .then(
                //         function(result) {
                //             // ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¼ÐµÑÑ‚Ð¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ.
                //             var userAddress = result.geoObjects.get(0).properties.get('text');
                //             var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
                //             // ÐŸÑ€Ð¾Ð¿Ð¸ÑˆÐµÐ¼ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð½Ñ‹Ð¹ Ð°Ð´Ñ€ÐµÑ Ð² Ð±Ð°Ð»ÑƒÐ½Ðµ.
                //             result.geoObjects.get(0).properties.set({
                //                 balloonContentBody: 'ÐÐ´Ñ€ÐµÑ: ' + userAddress +
                //                     '<br/>ÐšÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ‚Ñ‹:' + userCoodinates
                //             });
                //             myMap.geoObjects.add(result.geoObjects)
                //         },
                //         function(err) {
                //             console.log('ÐžÑˆÐ¸Ð±ÐºÐ°: ' + err)
                //         }
                //     );

            });

        }
    });

})();
function checkPhone()
{
    let phone = document.querySelector('.mask--phone').value;
    phone = phone.replace(/[^0-9]/g, "")

    if(phone.length < 11)
    {
        return false;
    }
    return true;
}

function checkForm(formName){

    var formValid = true;
    var parentDiv = $('form[name='+formName+']').parent('div');
    let type;

    $('form[name='+formName+']').find(':input[required]').each(function(){
        type = this.getAttribute('type');
        let value = '';
        if(type === 'tel')
        {
            value = this.value.replace(/[^0-9]/g, "");
        } else {
            value =this.value.replace(/\s/gi,'');
        }

        if(value.length > 0)
        {
            $(this).siblings(".default-input__error").html('&nbsp;');
            $(this).removeClass('error-text');
            if(type === 'email' && !validEmail(value))
            {
                window.toast.error('ÐÐµ Ð²ÐµÑ€Ð½Ñ‹Ð¹ email');
                formValid = false;
            }
        }
        else
        {
            var errorMessage = 'ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ðµ';
            $(this).addClass('default-input__input--error');
            $(this).siblings(".default-input__error").find('.error-text').html(errorMessage);
            window.toast.error('Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ ' + $(this).attr('placeholder'));
            if (formValid) {
                $(this).focus();
            }
            formValid = false;
        }
    });
    if (formName==='rent' || formName==='buyCertificate') {
        let requiredChecked=document.querySelectorAll('.checkbox.required');
        requiredChecked.forEach((checkbox)=>{
            if (!checkbox.children[0].checked) {
                checkbox.classList.add("checkbox-error");
                window.toast.error('ÐÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ Ñ ÐŸÑ€Ð°Ð²Ð¸Ð»Ð°Ð¼Ð¸ Ñ„Ð¾Ñ‚Ð¾ÑÑ‚ÑƒÐ´Ð¸Ð¸ Ð¸ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¾Ð¹ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸');
                formValid=false;
            } else {
                checkbox.classList.remove("checkbox-error");
            }

        })
    }

    return formValid;

}

function createErrorPlate(error) {
    document.body.insertAdjacentHTML("beforeend", `
            <div class='error-plate'>${error}</div>
          `)
    setTimeout(() => {
        document.querySelectorAll('.error-plate').forEach(item => item.remove())
    }, 7000)
}


function checkForms(iblock_id) {
    let submit = true
    let form = document.getElementById(iblock_id)
    let inputs = form.querySelectorAll('.form__inputs-input')

    for (let elem of inputs) {
        let input = elem.querySelector('.default-input__input')
        let error = elem.querySelector('div.error-text')

        let errorMessage = '';
        if(input.value === '')
            errorMessage = 'ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ðµ';
        else
            errorMessage = 'ÐŸÐ¾Ð»Ðµ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¾ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ð¾';

        if (!input.value.replace(/\s+/g, '') && input.required) {
            submit = false;
            input.classList.add('default-input__input--error');
            error.innerHTML = errorMessage
        } else if (input.type === 'tel' && validPhone(input.value) === false) {
            submit = false;
            input.classList.add('default-input__input--error');
            error.innerHTML = errorMessage
        } else if (input.type === 'email' && validEmail(input.value) === false) {
            submit = false;
            input.classList.add('default-input__input--error');
            error.innerHTML = errorMessage
        } else if (input.type === 'date' && validDate(input.value) === false) {
            submit = false;
            input.classList.add('default-input__input--error');
            error.innerHTML = errorMessage
        } else {
            input.classList.remove('default-input__input--error');
        }

    }
    return submit
}


function validPhone(phone) {
    if (phone.replaceAll(/\D+/g,'').length !== 11) {
        return false
    }
    return true;
}

function validDate(date) {
    if (date.length !== 10) {
        return false
    }

    return true;
}

function validEmail(email) {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(email) === false) {
        return false
    }

    return true
}
function changeCertInfo(el) {

    let price=el.getAttribute('data-price').replace(
        /^(\d{1,2})(\d{3})/,
        '$1 $2'
    );
    document.getElementById('certificate-buy').style.display='block'
    let name=el.getAttribute('data-name');
    document.getElementById('type-price').innerHTML=price+' Ñ€ÑƒÐ±.';
    document.getElementById('total-price').innerHTML='Ð’Ð¡Ð•Ð“Ðž Ðš ÐžÐŸÐ›ÐÐ¢Ð•: ' + price.toLocaleString()+' Ð Ð£Ð‘.';
    document.getElementById('type-name').innerHTML=name;
    document.querySelector('button.btn--bg').style.display='block';
}

function toPayment(form) {
    let formData = new FormData(document.forms.buyCertificate);
    formData.append('handler', 'buyCertificate');
    fetch('/certificates/ajax.php', {
        method: 'POST',
        body: formData
    }).then(
        response => {
            response.json().then(answer => {
                if(answer.orderId){
                    location.href='https://securepayments.sberbank.ru/payment/merchants/sbersafe_sberid/payment_ru.html?mdOrder=' + answer.orderId;
                }else if(answer.error){
                    window.toast.error(answer.error);
                }
                console.log(answer);
            });
        },
    );
    return false;
}