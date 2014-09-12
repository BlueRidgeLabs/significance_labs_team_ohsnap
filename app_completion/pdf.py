from pyPdf import PdfFileWriter, PdfFileReader
import csv
from fdfgen import forge_fdf
import os
import sys, getopt

sys.path.insert(0, os.getcwd())
pdf_file = "./app_completion/SNAPFORM.pdf"

output_folder = os.getcwd() + '/output/'


opts, args = getopt.getopt(sys.argv[1:], '', ["Name=", "1_FN=", "1_LN=","1_Name_Income=", "Address=", "Apt=", "Zip=",
                                              "City=", "Tel=", "Date=", "ID=", "1_SSN=", "1_DOB=",
                                              "1_Mar_Status=", "Blind=", "Citizen=", "Household_Money=", "Rent=",
                                              "2_FN=", "2_LN=", "2_Applying=", "2_SSN=", "2_DOB=", "2_Rel=",
                                              "3_FN=", "3_LN=", "3_Applying=", "3_SSN=", "3_DOB=", "3_Rel=",
                                              "4_FN=", "4_LN=", "4_Applying=", "4_SSN=", "4_DOB=", "4_Rel=",
                                              "5_FN=", "5_LN=", "5_Applying=", "5_SSN=", "5_DOB=", "5_Rel=",
                                              "6_FN=", "6_LN=", "6_Applying=", "6_SSN=", "6_DOB=", "6_Rel=",
                                              "7_FN=", "7_LN=", "7_Applying=", "7_SSN=", "7_DOB=", "7_Rel=",
                                              "8_FN=", "8_LN=", "8_Applying=", "8_SSN=", "8_DOB=", "8_Rel=",
                                              "1_Amount=", "1_Hours=", "1_Freq=",
                                              "2_Amount=", "2_Hours=", "2_Freq=",
                                              "3_Amount=", "3_Hours=", "3_Freq=",
                                              "4_Amount=", "4_Hours=", "4_Freq=",
                                              "5_Amount=", "5_Hours=", "5_Freq=",
                                              "6_Amount=", "6_Hours=", "6_Freq=",
                                              "7_Amount=", "7_Hours=", "7_Freq=",
                                              "8_Amount=", "8_Hours=", "8_Freq=",
                                              "2_name_income=", "3_name_income=", "4_name_income=", "5_name_income=",
                                              "6_name_income=", "7_name_income=", "8_name_income="])

formatted_data = []
tmp_id = ""

for opt, a in opts:
    if opt=='--Name':
        formatted_data.append(('Name', a))
    elif opt=='--Address':
        formatted_data.append(('Address', a))
    elif opt=='--Apt':
        formatted_data.append(('Apt', a))
    elif opt=='--Zip':
        formatted_data.append(('Zip', a))
    elif opt=='--City':
        formatted_data.append(('City', a))
    elif opt=='--Tel':
        formatted_data.append(('Tel', a))
    elif opt=='--Date':
        formatted_data.append(('sig_date', a))
    elif opt=='--ID':
        tmp_id = a
    elif opt=='--1_SSN':
        formatted_data.append(('1_ssn', a))
    elif opt=='--1_DOB':
        formatted_data.append(('1_dob', a))
    elif opt=='--1_Mar_Status':
        formatted_data.append(('1_marital_status', a))
    elif opt=='--Blind':
        formatted_data.append(('blind_yes', a))
    elif opt=='--Citizen':
        formatted_data.append(('citizen_yes', a))
    elif opt=='--Household_Money':
        formatted_data.append(('money_in_household', a))
    elif opt=='--Rent':
        formatted_data.append(('monthly_rent', a))
    elif opt=='--1_FN':
        formatted_data.append(('1_first_name', a))
    elif opt=='--1_LN':
        formatted_data.append(('1_last_name', a))
    elif opt=='--1_Name_Income':
        formatted_data.append(('1_name_income', a))
    elif opt=='--2_FN':
        formatted_data.append(('2_first_name', a))
    elif opt=='--2_LN':
        formatted_data.append(('2_last_name', a))
    elif opt=='--2_Applying':
        formatted_data.append(('2_applying_yes', a))
    elif opt=='--2_SSN':
        formatted_data.append(('2_ssn', a))
    elif opt=='--2_DOB':
        formatted_data.append(('2_dob', a))
    elif opt=='--2_Rel':
        formatted_data.append(('2_relationship', a))
    elif opt=='--3_FN':
        formatted_data.append(('3_first_name', a))
    elif opt=='--3_LN':
        formatted_data.append(('3_last_name', a))
    elif opt=='--3_Applying':
        formatted_data.append(('3_applying_yes', a))
    elif opt=='--3_SSN':
        formatted_data.append(('3_ssn', a))
    elif opt=='--3_DOB':
        formatted_data.append(('3_dob', a))
    elif opt=='--3_Rel':
        formatted_data.append(('3_relationship', a))
    elif opt=='--4_FN':
        formatted_data.append(('4_first_name', a))
    elif opt=='--4_LN':
        formatted_data.append(('4_last_name', a))
    elif opt=='--4_Applying':
        formatted_data.append(('4_applying_yes', a))
    elif opt=='--4_SSN':
        formatted_data.append(('4_ssn', a))
    elif opt=='--4_DOB':
        formatted_data.append(('4_dob', a))
    elif opt=='--4_Rel':
        formatted_data.append(('4_relationship', a))
    elif opt=='--5_FN':
        formatted_data.append(('5_first_name', a))
    elif opt=='--5_LN':
        formatted_data.append(('5_last_name', a))
    elif opt=='--5_Applying':
        formatted_data.append(('5_applying_yes', a))
    elif opt=='--5_SSN':
        formatted_data.append(('5_ssn', a))
    elif opt=='--5_DOB':
        formatted_data.append(('5_dob', a))
    elif opt=='--5_Rel':
        formatted_data.append(('5_relationship', a))
    elif opt=='--6_FN':
        formatted_data.append(('6_first_name', a))
    elif opt=='--6_LN':
        formatted_data.append(('6_last_name', a))
    elif opt=='--6_Applying':
        formatted_data.append(('6_applying_yes', a))
    elif opt=='--6_SSN':
        formatted_data.append(('6_ssn', a))
    elif opt=='--6_DOB':
        formatted_data.append(('6_dob', a))
    elif opt=='--6_Rel':
        formatted_data.append(('6_relationship', a))
    elif opt=='--7_FN':
        formatted_data.append(('7_first_name', a))
    elif opt=='--7_LN':
        formatted_data.append(('7_last_name', a))
    elif opt=='--7_Applying':
        formatted_data.append(('7_applying_yes', a))
    elif opt=='--7_SSN':
        formatted_data.append(('7_ssn', a))
    elif opt=='--7_DOB':
        formatted_data.append(('7_dob', a))
    elif opt=='--7_Rel':
        formatted_data.append(('7_relationship', a))
    elif opt=='--8_FN':
        formatted_data.append(('8_first_name', a))
    elif opt=='--8_LN':
        formatted_data.append(('8_last_name', a))
    elif opt=='--8_Applying':
        formatted_data.append(('8_applying_yes', a))
    elif opt=='--8_SSN':
        formatted_data.append(('8_ssn', a))
    elif opt=='--8_DOB':
        formatted_data.append(('8_dob', a))
    elif opt=='--8_Rel':
        formatted_data.append(('8_relationship', a))
    elif opt=='--1_Amount':
        formatted_data.append(('1_amount', a))
    elif opt=='--1_Hours':
        formatted_data.append(('1_hours_per_month', a))
    elif opt=='--1_Freq':
        formatted_data.append(('1_how_often', a))
    elif opt=='--2_Amount':
        formatted_data.append(('2_amount', a))
    elif opt=='--2_Hours':
        formatted_data.append(('2_hours_per_month', a))
    elif opt=='--2_Freq':
        formatted_data.append(('2_how_often', a))
    elif opt=='--3_Amount':
        formatted_data.append(('3_amount', a))
    elif opt=='--3_Hours':
        formatted_data.append(('3_hours_per_month', a))
    elif opt=='--3_Freq':
        formatted_data.append(('3_how_often', a))
    elif opt=='--4_Amount':
        formatted_data.append(('4_amount', a))
    elif opt=='--4_Hours':
        formatted_data.append(('4_hours_per_month', a))
    elif opt=='--4_Freq':
        formatted_data.append(('4_how_often', a))
    elif opt=='--5_Amount':
        formatted_data.append(('5_amount', a))
    elif opt=='--5_Hours':
        formatted_data.append(('5_hours_per_month', a))
    elif opt=='--5_Freq':
        formatted_data.append(('5_how_often', a))
    elif opt=='--6_Amount':
        formatted_data.append(('6_amount', a))
    elif opt=='--6_Hours':
        formatted_data.append(('6_hours_per_month', a))
    elif opt=='--6_Freq':
        formatted_data.append(('6_how_often', a))
    elif opt=='--7_Amount':
        formatted_data.append(('7_amount', a))
    elif opt=='--7_Hours':
        formatted_data.append(('7_hours_per_month', a))
    elif opt=='--7_Freq':
        formatted_data.append(('7_how_often', a))
    elif opt=='--8_Amount':
        formatted_data.append(('8_amount', a))
    elif opt=='--8_Hours':
        formatted_data.append(('8_hours_per_month', a))
    elif opt=='--8_Freq':
        formatted_data.append(('8_how_often', a))
    elif opt=='--2_name_income':
        formatted_data.append(('2_name_income', a))
    elif opt=='--3_name_income':
        formatted_data.append(('3_name_income', a))
    elif opt=='--4_name_income':
        formatted_data.append(('4_name_income', a))
    elif opt=='--5_name_income':
        formatted_data.append(('5_name_income', a))
    elif opt=='--6_name_income':
        formatted_data.append(('6_name_income', a))
    elif opt=='--7_name_income':
        formatted_data.append(('7_name_income', a))
    elif opt=='--8_name_income':
        formatted_data.append(('8_name_income', a))



formatted_data.append(('Applying','X'))

tmp_file = output_folder + "tmp" + str(tmp_id) + ".fdf"
filename_prefix = "SNAP_Application_" + str(tmp_id)

print formatted_data
#form_fill(formatted_data)

#def form_fill(fields):
fdf = forge_fdf("",formatted_data,[],[],[])
fdf_file = open(tmp_file,"w")
fdf_file.write(fdf)
fdf_file.close()
output_file = '{0}{1}.pdf'.format(output_folder, filename_prefix)
cmd = 'pdftk "{0}" fill_form "{1}" output "{2}" dont_ask'.format(pdf_file, tmp_file, output_file)
os.system(cmd)
os.remove(tmp_file)
#print "Printed data to pdf!"


input = PdfFileReader(file( output_file , "rb"))
watermark = PdfFileReader(file("./app_completion/sig.pdf" , "rb"))
output = PdfFileWriter()

page1 = input.getPage(1)
page1.mergePage(watermark.getPage(0))

output.addPage(input.getPage(1))
output.addPage(input.getPage(2))
output.addPage(input.getPage(3))

outputStream = file(os.getcwd() + "/output/Signed_"+filename_prefix+".pdf" , "wb")
output.write(outputStream)
outputStream.close()
os.remove(output_file)


