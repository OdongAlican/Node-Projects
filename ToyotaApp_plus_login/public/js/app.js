/*
The function below is used to check for correct inputs to the various fields on the 
toyota page.
*/


const ValidateData = (event) =>
{   
    /*
    This section is used to locate the various input fields with the ids assigned to them.
    Javacsript can acces the various input fields, check-boxes and radio-buttons with their ids
    as below
    */

    const customerID = document.getElementById("customer_id_input");
    const name = document.getElementById("name_value_input");
    const state = document.getElementById("state_input");
    const description = document.getElementById("description_value_input");
    const partNumber = document.getElementById("part_number_value_input");
    const price = document.getElementById("price_part_input");
    const quantity = document.getElementById("quantity_input");
    var retail = document.getElementById('retail');
    var oversizePrice = document.getElementById('oversize');
    var ups = document.getElementById('ups');
    var fedExGround = document.getElementById('fedExGround')
    var postal = document.getElementById('postal')
    var fedExAir = document.getElementById('fedExAir')

    /*
    Assigning a set of literals known as regular expressions to various constants. 
    This literals help to determine what ranges of input an input field should accept
    */

    const re_customerID = /^[(A-Z)(0-9)-]{2,15}$/;
    const re_state = /^[A-Z1-9]{3}$/;
    const re_description = /^[a-zA-Z ]{5,20}$/;
    const re_partNumber = /^[0-9]{2,6}$/;
    const re_quantity = /^[1-9]([0-9])?$/;
    const re_name = /^[a-zA-Z]{3,10}$/;


    /*
        The codes below help to check whether the inputs to the input fields are correct.
        if not, it advices the user what the field requires. if the input to a particular field is 
        correct, no warning is shown
    */


    if(!re_customerID.test(customerID.value)){
        document.getElementById("customer_span").innerHTML="Please Enter a Valid ID";
        return false;
    }
    else{
        document.getElementById("customer_span").innerHTML="";
    }

    if (!re_name.test(name.value)){
        document.getElementById("name_span").innerHTML = "Please Enter a Valid Name"
        return false;
    }

    else{
        document.getElementById("name_span").innerHTML = ""
    }

    if(!re_state.test(state.value)){
        document.getElementById("state_span").innerHTML = "Please Enter a Valid State"
        return false;
    }

    else{
        document.getElementById("state_span").innerHTML = ""
    }

    if(!re_partNumber.test(partNumber.value)){
        document.getElementById("number_span").innerHTML = "Please Enter a Valid Number"
        return false;
    }

    else{
        document.getElementById("number_span").innerHTML = ""
    }

    if(!re_description.test(description.value)){
        document.getElementById("description_span").innerHTML = "Please Enter a valid description"
        return false;
    }

    else{
        document.getElementById("description_span").innerHTML = ""
    }


    if (isNaN(price.value) || (price.value).trim() == ''){
        document.getElementById("price_span").innerHTML = "Enter Valid Price"
        return false;
    }

    else{
        document.getElementById("price_span").innerHTML = ""
    }


    if(!re_quantity.test(quantity.value)){
        document.getElementById("qtn_span").innerHTML = "Enter Valid Qty"
        return false;
    }

   else{
        document.getElementById("qtn_span").innerHTML = ""
        
        /*
            The code below is used to assign price to various shipping methods.
            only one of them can be selected at a time
        */

        const shippingHandling = () =>{

            if(ups.checked){
                ups = (quantity.value) * 7.00
                document.getElementById('shipping').innerHTML = `$${ups.toFixed(2)}`
            }
    
            else{
                ups = 0;
            }
    
            if(fedExGround.checked){
                fedExGround = (quantity.value) * 8.50
                document.getElementById('shipping').innerHTML = `$${fedExGround.toFixed(2)}` 
            }
    
            else{
                fedExGround = 0
            }
    
            if(postal.checked){
                postal = (quantity.value) * 9.25
                document.getElementById('shipping').innerHTML = `$${postal.toFixed(2)}`
            }
    
            else{
                postal = 0
            }
    
            if(fedExAir.checked){
                fedExAir = (quantity.value) * 12.00
                document.getElementById('shipping').innerHTML = `$${fedExAir.toFixed(2)}`
            }
            else{
                fedExAir = 0
            }

            }
            
            shippingHandling();
        
        const cost = quantity.value * price.value

        /*
            the block of codes below is used to determine the sales tax from various states.
            if a user is a retailer and is within certain states, he is subjected to some taxes.
        */
            
        const salesTax = costs => {
                    
            var tax;

            if(state.value === 'KLA' && retail.checked){
            document.getElementById('sales').innerHTML = `$${(costs*0.1).toFixed(2)}`
            tax = (costs*0.1)
            }

            else if((state.value === 'EBB'|| state.value === 'MBR') && retail.checked){
                document.getElementById('sales').innerHTML = `$${(costs * 0.05).toFixed(2)}`;
                tax = (costs*0.05)
            }

            else{
                tax = 0;
                document.getElementById('sales').innerHTML = '$' + tax;
            }

            if(oversizePrice.checked){
                oversizePrice = 5;
            }
            
            else{
                oversizePrice = 0;           
                }

                document.getElementById('cost').innerHTML = '$'+ (cost).toFixed(2);
                document.getElementById('total').innerHTML = '$' + (oversizePrice + cost + tax + ups + fedExGround + postal + fedExAir).toFixed(2)
            }
            
            salesTax(cost);
   }
    event.preventDefault();
    return true;
}

ValidateData();

/*
    The block of code below is for new order.
    it makes sure that all the input fields are empty and sets retail to checked and UPS to default shipping
*/

const NewOrder = () => {
   document.getElementById("customer_id_input").value = '';
   document.getElementById("customer_id_input").focus();
   document.getElementById("name_value_input").value = '';
   document.getElementById("state_input").value='';
   document.getElementById("description_value_input").value = '';
   document.getElementById("part_number_value_input").value = '';
   document.getElementById("price_part_input").value = '';
   document.getElementById("quantity_input").value='';
   document.getElementById('retail').checked = true;
   document.getElementById('oversize').checked = false;
   document.getElementById('ups').checked=true;
   document.getElementById('cost').innerHTML = "";
   document.getElementById('sales').innerHTML = '';
   document.getElementById('shipping').innerHTML = '';       
   document.getElementById('total').innerHTML = '';
}


// The block of code enables the user to exit the page. 

const close_window = () => {
    if (confirm("Close Window?")) {
        window.location = "http://www.google.com/";
    }
  }