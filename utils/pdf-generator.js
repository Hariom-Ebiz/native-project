

const generatePDF = async (htmlContent, outputPath) => {
    htmlToPdf().from(htmlContent).save(outputPath);
};

export default generatePDF;