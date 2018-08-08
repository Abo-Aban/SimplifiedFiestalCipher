/* 
 * Simplified Fiestal Cipher 
 * Developed by: Othman M. Aladlan
 * 
 * All right reserved @ 5/Augest/2018
 * 
 * Brief:   Simple program to encrypt/decrypt using simplified version of fiestal
 *          cipher, using block size of Character (8-bit), and SBoxes expansion
 *          method.
 *
*/

$(function() {

    /*========= Random Generators =========*/
    
    // random initial permutaion generator
    
        // clicking the random ip button    
        $('#ip_gen').click(function() {
            // generate the ip
            var ip = rnd_perm(8);            
            // assign ip to input
            $('#ip').val(ip.join(''));
            console.log("Initial Permutaion Generated: " + ip.join(''));

                var tmp_ip_inv = [];
                //get the initial permutation
            tmp_ip = ip.join('');
            // calculate the ip-inv
            for(var i = 0; i < 8; ++i) {
                tmp_ip_inv[tmp_ip[i]-1] = i+1;
                // console.log("tmp_ip_inv["+tmp_ip[i]+"]");
            }
            // assign the ip-inv to the input
            $('#ip-inv').val( tmp_ip_inv.join(''));
            console.log("IP Inverse Generated: " + tmp_ip_inv.join(''));
        });
    
    // random key generator
        // clicking the random key button    
        $('#key_gen').click(function() {
            // generate the key
            var key = (Math.floor(Math.random()*255)+1).toString(2);
            // zaro pad the number
            key = zero_padding(key, 8);
            // assign key to input
            $('#key').val(key);
            console.log("Key Generated: " + key);
            
        });
    // random sub key generator

    // initial subkeys
    subkeys = [
        [ 0, 1, 2, 3 ],
        [ 2, 3, 0, 1 ],
        [ 3, 2, 1, 0 ],
        [ 1, 0, 3, 2 ],
    ];

    // subkey 1 random button on click event
    $('#sk-1_gen').click(function() {
        console.log("Generating Subkey-1.");
        subkey_generator(1);
    });

    // subkey 2 random button on click event
    $('#sk-2_gen').click(function() {
        console.log("Generating Subkey-2.");
        subkey_generator(2);
    });


    /*=====================================*/
    
    
    
    /*=========== Encryption ==============*/
    
    // ecncrypt button onclick event
    $('#encrypt_btn').click(function() {

    // verification phase
        // verify the key {length, binary}
        // verify the IP  {length, 1-8}
        // verify the Subkeys {all set, 0-3 permutations horizontaly and verticaly}
        // verify the plaintext

        var tmp_ip, tmp_ip_inv=[], tmp_PT, tmp_char,
            tmp_char_perm=$('#ip-inv').val(),
            res = "", ip = $('#ip').val(), ip_inv = $('#ip-inv').val(),
            key = $('#key').val(), rounds = $('#rounds').val(), tmp;

    // reseting the ciphertext input field
        $('#ciphertext').val('');
    
    // calculating the inverse Initial Permutation
        // //get the initial permutation
        // tmp_ip = $('#ip').val().trim();
        // // calculate the ip-inv
        // for(var i = 0; i < 8; ++i) {
        //     tmp_ip_inv[tmp_ip[i]-1] = i+1;
        //     // console.log("tmp_ip_inv["+tmp_ip[i]+"]");
        // }
        // // assign the ip-inv to the input
        // $('#ip-inv').val( tmp_ip_inv.join(''));
        // console.log("IP Inverse Generated: " + tmp_ip_inv.join(''));
    
    // iterate through all plaintext characters and encrypt them
        // get the plaintext
        tmp_PT = $('#plaintext').val();    
        for(var i = 0; i < tmp_PT.length; ++i) {
            // convert the character into Binary 
            tmp_char = zero_padding(tmp_PT[i].charCodeAt(0).toString(2), 8);
            console.log(tmp_PT[i] + ": " + tmp_char);
            
            // permutate the tmp_char using IP
            tmp_char_perm = "";
            for(var u = 0; u < 8; ++u) {
                tmp_char_perm += tmp_char[ip[u]-1];
            }

            console.log("PT permutated: " + tmp_char_perm);
            
            res = tmp_char_perm;
            // start an encryption phase
            for(var j = 0; j < rounds; ++j) {
                console.log("Starting Encryption Round #" + j + ": ");
                res = enc_round(res, key);
            }



            // permutate the res using IP-inv
            tmp_char_perm = "";
            for(var u = 0; u < 8; ++u) {
                tmp_char_perm += res[ip_inv[u]-1];
            }
            console.log("before-permutated: " + res + " \n");

            res = tmp_char_perm;

            console.log("res: " + res + " \n\n");
            console.log("=====================");
            

            // add the encrypted char to ciphertext
            tmp = $("#ciphertext").val();
            $("#ciphertext").val(tmp + res + " ");

        }
        
            

        
    });
    /*=====================================*/

    /*=========== Decryption ==============*/
    // decrypt button on click method
    $('#decrypt_btn').click(function() {
        
        var tmp_cipher = "", tmp_char, res, ip = $('#ip').val(),
            ip_inv = $('#ip-inv').val(), key = $('#key').val(), tmp,
            rounds = $('#rounds').val();
        
        //get the ciphertext    
        tmp_cipher = $("#ciphertext").val().trim().split(' ');
        //reset the plaintext
        $('#plaintext').val('');

    // iterate through all plaintext characters and encrypt them
    
        for(var i = 0; i < tmp_cipher.length; ++i) {
            tmp_char = tmp_cipher[i];
            // permutate the tmp_char using IP
            tmp_char_perm = "";
            for(var u = 0; u < 8; ++u) {
                tmp_char_perm += tmp_char[ip[u]-1];
            }

            console.log("Cipher permutated: " + tmp_char_perm);
            
            res = tmp_char_perm;
            // start an decryption phase
            for(var j = 0; j < rounds; ++j) {
                console.log("Starting Decryption Round: ");
                res = dec_round(res, key);
            }

            // permutate the res using IP-inv
            tmp_char_perm = "";
            for(var u = 0; u < 8; ++u) {
                tmp_char_perm += res[ip_inv[u]-1];
            }
            console.log("before-permutated: " + res + " \n");

            res = tmp_char_perm;

            console.log("res: " + res + " \n\n");
            console.log("=====================");
            

            // convert the res into characters
            var ttt  = res;
            ttt = String.fromCharCode(parseInt(res, 2));
            // console.log("SSS: " + ttt);
            


            // add the decrypted char to plaintext
            tmp = $("#plaintext").val();
            $("#plaintext").val(tmp + ttt + " ");
            $("#plaintext").val($("#plaintext").val().trim());

        }
        


    });
    
    /*=====================================*/

});



// function to execute one round of encryption
function enc_round(pt, key) {
    var LE, RE, LE1, RE1, tmp;
    
    // split the pt into LE and RE
    LE = pt.substr(0,4);
    RE = pt.substr(4,4);
    console.log("Splitting the pt into two parts: L: " + LE + " R: " + RE);
    
    // LEi = REi-1;
    LE1 = RE;
    console.log("Assigning the old right to the new Left");

    // REi = LEi-1 (xor) ( REi-1 (xor) key )
        // expand the REi-1
    RE = expand(RE);
    // xoring the RE with the key
    RE1 = ( parseInt(RE, 2) ^ parseInt(key, 2)).toString(2);
    RE1 = zero_padding(RE1 , 8);
    console.log("xoring the RE with the key");
    
        // shrink the function part
    RE1 = shrink(RE1);

    // xoring the LE with the function part
    RE1 = ( parseInt(LE, 2) ^ parseInt(RE1, 2)).toString(2);
    RE1 = zero_padding(RE1 , 4);
    console.log("xoring the LE with the function part");


    // concatenate the LE1 with RE1
    tmp = LE1 + RE1;
    console.log("concatenating the LEi with REi");
    


    return tmp;

}

// function to execute one round of decryption
function dec_round(ct, key) {
    var LE, RE, RD, LD, tmp;
    
    // split the ct into LE and RE
    LE = ct.substr(0,4);
    RE = ct.substr(4,4);
    console.log("Splitting the ct into two parts: L: " + LE + " R: " + RE);
    
    // RDj = LEi;
    RD = LE;
    console.log("Assigning the old right to the new Left");

    // LDj = REi (xor) ( LEi (xor) key )
        // expand the LEi
    LE = expand(LE);
    // xoring the LE with the key
    LD = ( parseInt(LE, 2) ^ parseInt(key, 2)).toString(2);
    LD = zero_padding(LD , 8);
    console.log("xoring the LE with the key");
    
        // shrink the function part
    LD = shrink(LD);

    // xoring the RE with the function part
    LD = ( parseInt(RE, 2) ^ parseInt(LD, 2)).toString(2);
    LD = zero_padding(LD , 4);
    console.log("xoring the RE with the function part");


    // concatenate the LD with RD
    tmp = LD + RD;
    console.log("concatenating the LDj with RDj");
    
    return tmp;

}

// receive 4-bit string return 8-bit
function expand(pt) {
    var tmp = "", ordr = "30121230";
    // change the order of pt
    for(var i = 0; i < 8; ++i) {
        tmp += pt[ordr[i]];
    }
    console.log(pt + " expanded into " + tmp);
    
    return tmp;
}

// receive 8-bit string return 4-bit
function shrink(pt) {
    var tmp = "", s1, s2;
    // 00 00 - 00 00
    // R  C    R  C
    
    // get the corresponding number in the sk-1
    s1 = $('#subkey-1').find('tr').eq(parseInt(pt.substr(0,2), 2)).find('td').eq(parseInt(pt.substr(2,2), 2)).find('input').val();
    s1 = parseInt(s1).toString(2); // convert to binary
    s1 = zero_padding(s1, 2); // zero pad the s1
    
    // get the corresponding number in the sk-2
    s2 = $('#subkey-2').find('tr').eq(parseInt(pt.substr(4,2), 2)).find('td').eq(parseInt(pt.substr(6,2), 2)).find('input').val();
    s2 = parseInt(s2).toString(2); // convert to binary
    s2 = zero_padding(s2, 2); // zero pad the s2

    tmp = s1 + s2;

    console.log(pt + " shrinked into " + tmp);
    return tmp;
    
}


// random permutaion function generator
function rnd_perm(n) {
    var tmp1, swap, arr = [];
    // add the elements to the array
    for(var i = 1; i <= n; ++i) {
        arr.push(i);
    }

    // shuffle items
    for(var i = 0; i < n; ++i) {
        tmp = Math.floor(Math.random()*n);
        swap = arr[i];
        arr[i] = arr[tmp];
        arr[tmp] = swap;
    }

    // return the array
    return arr;
}

// random subkey 2d-matrix permutation generation function
function subkey_generator(subkey_no){
    var tmp_arr = [], tmp;

    for(var i = 0; i < 4; ++i) {
        // generate random number 0-3
        tmp = Math.floor(Math.random()*4);
        // swap current row with the random row
        tmp_arr = subkeys[tmp];
        subkeys[tmp] = subkeys[i];
        subkeys[i] = tmp_arr;
    }

    // cache the table object for performence reason
    if(subkey_no == 1){
         table_obj = $('#subkey-1');
    }else{
         table_obj = $('#subkey-2');
    }

    // assign the matrix to the inputs
    for(var i = 0; i < 4; ++i) {
        for(var j = 0; j < 4; ++j) {
            table_obj.find('tr').eq(i).find('td').eq(j).find('input').val(subkeys[i][j]);
        }
    }

}

// function for zero padding number
function zero_padding(n, size){
    var tmp = '00000000' + n;
    return tmp.substr(size*-1);
}

// function to swap to values
function swapp(arr, n, m) {
    var tmp = arr[n];
    arr[n] = arr[m];
    arr[m] = tmp;
    return arr;
}