import React, { useState } from "react";
import { Container, VStack, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setHeaders(result.meta.fields);
        setCsvData(result.data);
      },
    });
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e, rowIndex, columnName) => {
    const newData = [...csvData];
    newData[rowIndex][columnName] = e.target.value;
    setCsvData(newData);
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {csvData.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header, index) => (
                    <Th key={index}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {csvData.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <Td key={colIndex}>
                        <Input
                          value={row[header] || ""}
                          onChange={(e) => handleInputChange(e, rowIndex, header)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <IconButton
                        aria-label="Remove row"
                        icon={<FaTrash />}
                        onClick={() => handleRemoveRow(rowIndex)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} onClick={handleAddRow}>
              Add Row
            </Button>
            <Button colorScheme="blue" onClick={handleDownload}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;