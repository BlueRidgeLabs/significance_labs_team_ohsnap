from pyPdf import PdfFileWriter, PdfFileReader

input = PdfFileReader(file("SNAPFORM.pdf", "rb"))
watermark = PdfFileReader(file("sig.pdf", "rb"))
output = PdfFileWriter()

page1 = input.getPage(1)
page1.mergePage(watermark.getPage(0))

output.addPage(input.getPage(1))

outputStream = file("test-output.pdf", "wb")
output.write(outputStream)
outputStream.close()

