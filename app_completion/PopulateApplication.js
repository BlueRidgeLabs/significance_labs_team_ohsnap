/**
 * Created by airswoop1 on 7/11/14.
 */

var MongoClient = require('../database.js');
var exec = require('child_process').exec;
var cities = require('cities');



var PopulateApplication = (function(){

    console.log("executing PopulateApplication")
    var success_ct = 0,
        error_ct = 0,
        total = 0;

    MongoClient.getConnection(function(db_err, db){
        if(db_err) {
            console.log(db_err);
            return;
        }
        else {

            var collection = db.collection('users'),
	            //opts = {"limit":50},
	            //query = {"user_id":"b1883805-7a5e-409e-a630-6f543a59198f"};
                //query = {$or:[{'completed':{$exists:false}},{'completed':false}], "documents":{'$exists':false} ,'created_on':{'$lt':1407798000000}};
	            query = {'completed':true, "documents":{'$exists':false} ,'created_on':{'$lt':1407798000000}};

            collection.find(query, //opts,
                function(err, cursor){
                    if(err){
                        console.log("error with query in populate application!");
                        console.log(err);
                    }
                    else{
                        cursor.toArray(function(e, docs){
                            total = docs.length;
							/*docs.forEach(function(i){
								var percent_completed=0;

								for(var x in i){
									if(i.hasOwnProperty(x)){
										percent_completed++;
									}
								}

								console.log(i.user_id + ", " + i.name.first_name + " " + i.name.last_name + ", " + i.phone_main + ", " + i.ssn + ", " + percent_completed);
							});*/
	                        docs.forEach(processApp);
                            return;
                        })
                    }
                });
        }
    })


    function processApp(data){
        format_request(data, function(err, formatted_data) {
	        if(!err){
	            populate_pdf(formatted_data, function(err, result, tmp_file) {
	                update_DB_pdfCreated(err, result, tmp_file);
	            })
	        }
        })

    }

    function format_request(r, cb) {
        var formatted_data = {};
		var has_household_members = true;

	    if(r.name.first_name.length <= 2 || r.name.last_name.length <= 2 || r.name.first_name == "test" || r.name.first_name == "Test"){
		    error_ct++;
		    cb("bad data");
	    }

        formatted_data['name'] = r.name.first_name + " " + r.name.last_name;
        formatted_data['1_first_name'] =r.name.first_name;
	    formatted_data['1_last_name'] =r.name.last_name;
	    formatted_data["1_name_income"] = formatted_data['name'];
	    formatted_data['phone_main'] = (typeof r.phone_main !== "undefined") ? r.phone_main : " ";
	    formatted_data['ssn'] = (typeof r.ssn !== 'undefined') ? r.ssn : " ";
	    formatted_data['dob'] = (typeof r.dob !== 'undefined') ? r.dob : " ";
	    formatted_data['marital_status'] = (typeof r.marital !== 'undefined') ? r.marital : " ";
	    formatted_data['citizen'] = (typeof r.citizen !== 'undefined' && r.citizen == 'yes') ? "X" : " ";
	    formatted_data['resources'] = (typeof r.total_resources !== 'undefined') ? r.total_resources : " ";
	    formatted_data['1_hours_per_month'] = (typeof r.hours_wk !== 'undefined' && typeof r.wk_month !== 'undefined') ? (parseInt(r.hours_wk) * parseInt(r.wk_month)).toString() : " ";
	    formatted_data['1_how_often'] = " ";


	    if(typeof r.user_id !== 'undefined'){
		    formatted_data['tmp_id'] = r.user_id.replace(/\-/g,'');
		    formatted_data['user_id'] = r.user_id;
	    }

	    if(typeof r.address !== "undefined"){
		    formatted_data['address'] = (typeof r.address.street_address === "undefined") ? " " : r.address.street_address;
		    formatted_data['apt'] = (typeof r.address.apt_number === "undefined") ? " " : r.address.apt_number;
		    formatted_data['zip'] = (typeof r.address.zip === "undefined") ? " " : r.address.zip;

		    if(formatted_data['zip'] !== ' ' && formatted_data['zip'] !== null){

			    var location = cities.zip_lookup(r.address.zip);
			    formatted_data['city'] = (typeof location === "undefined" || location == null) ? " " : location.city;
		    }
		    else{
			    formatted_data['city'] = ' ';
		    }

	    }
	    else {
		    formatted_data['address'] = "N/A";
		    formatted_data['apt'] = " ";
		    formatted_data['zip'] = " ";
		    formatted_data['city'] = " ";
	    }

	    if(typeof r.monthly_income !== 'undefined'){
		    formatted_data['1_amount'] = r.monthly_income;
	    }
	    else if(typeof r.income !== 'undefined') {
		    formatted_data['1_amount'] = r.income;
	    }
	    else {
		    formatted_data['1_amount'] = " ";
	    }

	    if(typeof r.rent ==! 'undefined') {
			formatted_data['rent'] = r.rent;
	    }
	    else if(typeof r.utilities !== 'undefined' && typeof r.utilities.rent !== 'undefined') {
		    formatted_data['rent'] = r.utilities.rent;
	    }
	    else {
		    formatted_data['rent'] = " ";
	    }

	    if(typeof r.personal_disabled !== "undefined" || r.disabled !== 'undefined'){
		    if(r.personal_disabled == true || r.personal_disabled == "true" || r.personal_disabled == "yes" || r.personal_disabled == "Yes"){
			    formatted_data['disabled'] = 'X'
		    }
		    else if(r.disabled == true || r.disabled == "true" || r.disabled == "yes" || r.disabled == "Yes") {
			    formatted_data['disabled'] = 'X'
		    }
		    else {
			    formatted_data['disabled'] = ' '
		    }
	    }
	    else {
		    formatted_data['disabled'] = ' '
	    }

	    if(typeof r.household_members !== 'undefined' && r.household_members.hasOwnProperty("0")){
		    for(var i=0;i<7; i++){
				var member =i.toString();
			    if(typeof r.household_members[member] === 'undefined'){
				    r.household_members[member] = {"name":" "};
			    }

			    if(typeof r.household_members[member].name === 'undefined'){
				    r.household_members[member]["name"] = " ";
			    }

		        var index = (parseInt(member) + 2).toString();
				formatted_data[index + "_first_name"] = (typeof r.household_members[member].name.split(' ')[0] !== "undefined") ? r.household_members[member].name.split(' ')[0] : " ";
				formatted_data[index + "_last_name"] = (typeof r.household_members[member].name.split(' ')[1] !== 'undefined') ? r.household_members[member].name.split(' ')[1] : " ";
			    formatted_data[index + "_name_income"] = (typeof r.household_members[member].name !== 'undefined') ? r.household_members[member].name : " "
			    formatted_data[index + "_ssn"] = (typeof r.household_members[member].ssn !== 'undefined') ? r.household_members[member].ssn : " ";
			    formatted_data[index + "_dob"] = (typeof r.household_members[member].dob !== 'undefined') ? r.household_members[member].dob : " ";
			    formatted_data[index + "_applying_yes"] = (typeof r.household_members[member].applying !== 'undefined' && (r.household_members[member].applying == 'true' || r.household_members[member].applying == true) ) ? "X" : " ";

			    if(typeof r.household_members[member].relation !== 'undefined' &&
				    typeof r.household_members[member].relation.relation !== 'undefined' &&
				    r.household_members[member].relation !== 'Select') {
				    formatted_data[index + "_relationship"] = r.household_members[member].relation.relation;
			    }
			    else if(typeof r.household_members[member].relation !== 'undefined' && r.household_members[member].relation !== 'Select') {
				    formatted_data[index + "_relationship"] = r.household_members[member].relation;
			    }
			    else {
				    formatted_data[index + "_relationship"] = " ";
			    }

			    formatted_data[index + "_amount"] = (typeof r.household_members[member].income !== 'undefined') ? r.household_members[member].income : "0";
			    formatted_data[index + "_hours_per_month"] = (typeof r.household_members[member].hours_wk !== 'undefined') ? r.household_members[member].hours_wk : " ";
			    formatted_data[index + "_how_often"] = (typeof r.household_members[member].wk_month !== 'undefined') ? r.household_members[member].wk_month + " times per month" : " ";


		    }
	    }
	    else {
		    has_household_members = false;
	    }

	    formatted_data['has_household_members'] = has_household_members;

        cb(null, formatted_data);
    }

    function populate_pdf(data, cb){
        var today = new Date(),
            dd = today.getDate(),
            mm = today.getMonth()+1,
            yyyy = today.getFullYear();

        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
        today = mm+'/'+dd+'/'+yyyy;


        var input = "python ./app_completion/pdf.py ";
        input += "--Name='" + data.name + "' ";
	    input += "--1_FN='" + data["1_first_name"] + "' ";
	    input += "--1_LN='" + data["1_last_name"] + "' ";
	    input += "--1_Name_Income='" + data["1_name_income"] + "' ";
        input += "--Address='" + data.address + "' ";
        input += "--Apt='" + data.apt + "' ";
        input += "--City='" + data.city + "' ";
        input += "--Zip='" + data.zip + "' ";
        input += "--Tel='" + data.phone_main + "' ";
        input += "--ID='" + data.tmp_id + "' ";
        input += "--Date='" + today + "' ";
	    input += "--1_SSN='" + data.ssn + "' ";
	    input += "--1_DOB='" + data.dob + "' ";
	    input += "--1_Mar_Status='" + data.marital_status + "' ";
	    input += "--Blind='" + data.disabled + "' ";
	    input += "--Citizen='" + data.citizen + "' ";
	    input += "--Household_Money='" + data.resources + "' ";
	    input += "--Rent='" + data.rent + "' ";
	    input += "--1_Amount='" + data["1_amount"] + "' ";
	    input += "--1_Hours='" + data["1_hours_per_month"]+ "' ";

	    if(data["has_household_members"]){
		    for(var i=0; i<7; i++){
			    var index = (i + 2).toString();
			    input += "--" + index + "_FN='" + data[index + "_first_name"] + "' ";
			    input += "--" + index + "_LN='" + data[index + "_last_name"] + "' ";
			    input += "--" + index + "_LN='" + data[index + "_last_name"] + "' ";
			    input += "--" + index + "_SSN='" + data[index + "_ssn"] + "' ";
			    input += "--" + index + "_Applying='" + data[index + "_applying_yes"] + "' ";
			    input += "--" + index + "_DOB='" + data[index + "_dob"] + "' ";
			    input += "--" + index + "_Rel='" + data[index + "_relationship"] + "' ";
			    input += "--" + index + "_Amount='" + data[index + "_amount"] + "' ";
			    input += "--" + index + "_Hours='" + data[index + "_hours_per_month"] + "' ";
			    input += "--" + index + "_Freq='" + data[index + "_how_often"] + "' ";
			    input += "--" + index + "_name_income='" + data[index + "_name_income"] + "' ";
		    }
	    }





        exec(input, function(error, stdout, stderr){
            console.log(error);
            console.log(stderr);
            if(error || stderr) {
                console.log('error parsing users form:');
                console.log(data.name);
                console.log(data.tmp_id);

                error_ct++;
                cb(error,data.user_id, data.tmp_id);
            }
            else {
                success_ct++;
                cb(null, data.user_id, data.tmp_id);
            }

        })
    }

    function update_DB_pdfCreated(err, user_id, tmp_id) {

        var completed = err ? false : true,
            file_name = "SNAP_Application_" + tmp_id + ".pdf",
            query = { "user_id" : user_id},
            update = {"$set": {'completed': completed, "output_file_name":  file_name}};
        console.log('outputted ' + file_name);
        MongoClient.getConnection(function(db_err, db) {
            if(db_err) {
                console.log  ('error saving pdf status to db');
                console.log(db_err);
            }
            else {
                var collection = db.collection('users');

                collection.findAndModify(
                    query,
                    [['_id','asc']],
                    update,
                    {"upsert":false, "multi": false},
                    function(db_write_err, result) {
                        if(db_write_err) {
                            console.log("db write error")
                        }


                        if((error_ct+success_ct) === total){
                            console.log("successfully created " + success_ct + " pdfs!");
                            console.log("errored out on " + error_ct + " pdfs");
                            process.exit(0);
                        }
                    })

            }
        })


    }

}());

module.exports = PopulateApplication;