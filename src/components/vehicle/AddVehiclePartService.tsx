import React, { useState, useEffect, useCallback } from "react";
import apiClient from "Services/apiService";
import {
  Grid,
  Box,
  Typography,
  Button,
  OutlinedInput,
  FormLabel,
  styled,
  Stack,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomizedDataGrid from "components/CustomizedDataGrid";
import { GridCellParams, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SparePartDeleteModel from "./SparePartDeleteModel";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface CreateTransaction {
  vehicleRegId?: number;
  partNumber: string;
  partName: string;
  manufacturer: string;
  quantity: number;
  amount: number;
  total: number;
  transactionType: string;
  billNo: number;
  sparePartTransactionId: number;
}

interface Feedback {
  message: string;
  severity: "success" | "error";
}

// Updated to include `price` in the suggestion
interface SpareFilterDto {
  sparePartId: number;
  partName: string;
  manufacturer: string;
  description: string;
  partNumber: string;
  price?: number; // <-- Add this if your backend returns a price
}

const initialCreateData: CreateTransaction = {
  vehicleRegId: undefined,
  partNumber: "",
  partName: "",
  manufacturer: "",
  quantity: 1,
  amount: 0,
  total: 0,
  transactionType: "DEBIT",
  billNo: 1,
  sparePartTransactionId: 0,
};

const AddVehiclePartService: React.FC = () => {
  const [createData, setCreateData] = useState<CreateTransaction>(initialCreateData);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [partSuggestions, setPartSuggestions] = useState<SpareFilterDto[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing transactions on mount (if ID is present)
  useEffect(() => {
    if (id) {
      fetchSparePartList();
    }
  }, [id]);

  const fetchSparePartList = async () => {
    try {
      const responsePart = await apiClient.get(
        `/sparePartTransactions/vehicleRegId?vehicleRegId=${id}`
      );

      if (!responsePart.data || responsePart.data.length === 0) {
        console.warn("No transactions found for this vehicleRegId");
        return;
      }

      const transactions: any = Array.isArray(responsePart.data)
        ? responsePart.data
        : [responsePart.data];
      const transactionsData = transactions[0].data;
      const newTransactions = transactionsData.map((resData: any, index: number) => ({
        id: rows.length + index + 1,
        partNumber: resData.partNumber,
        partName: resData.partName,
        manufacturer: resData.manufacturer,
        quantity: resData.quantity,
        amount: resData.price, // or resData.amount if your backend uses that
        total: resData.price * resData.quantity,
        transactionType: resData.transactionType,
        vehicleRegId: resData.vehicleRegId,
        sparePartTransactionId: resData.sparePartTransactionId,
      }));

      setRows([...newTransactions]);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  // Fetch part suggestions
  const fetchPartSuggestions = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setPartSuggestions([]);
      return;
    }
    try {
      // Make sure your backend returns `price` if you want to set createData.amount
      const response = await apiClient.get(`/Filter/search?keyword=${keyword}`);
      setPartSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching part suggestions:", error);
    }
  }, []);

  useEffect(() => {
    fetchPartSuggestions(debouncedSearch);
  }, [debouncedSearch, fetchPartSuggestions]);

  // Handle form changes
  const handleCreateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // When user selects a suggestion, populate partName, partNumber, manufacturer, and amount (price)
  const handleSelectSuggestion = (suggestion: SpareFilterDto) => {
    setCreateData((prev) => ({
      ...prev,
      partName: suggestion.partName,
      partNumber: suggestion.partNumber,
      manufacturer: suggestion.manufacturer,
      amount: suggestion.price || 0, // If your backend returns a price
    }));
    setSearchKeyword("");
    setPartSuggestions([]);
  };

  const handleClearSelection = () => {
    setCreateData((prev) => ({
      ...prev,
      partName: "",
      partNumber: "",
      manufacturer: "",
      amount: 0,
    }));
    setSearchKeyword("");
  };

  // Create new transaction
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...createData,
        vehicleRegId: Number(id),
        userId: null,
        total: createData.amount * createData.quantity, // compute total
      };
      const response = await apiClient.post("/sparePartTransactions/add", updatedData);
      const sparePartTransactionId = response.data?.data.sparePartTransactionId;
      const newTransaction = {
        id: rows.length + 1,
        partNumber: updatedData.partNumber,
        partName: updatedData.partName,
        manufacturer: updatedData.manufacturer,
        quantity: updatedData.quantity,
        amount: updatedData.amount,
        total: updatedData.amount * updatedData.quantity,
        transactionType: updatedData.transactionType,
        vehicleRegId: updatedData.vehicleRegId,
        sparePartTransactionId: sparePartTransactionId,
      };

      setRows((prevRows) => [...prevRows, newTransaction]);
      setFeedback({
        message: response.data.message || "Transaction created successfully",
        severity: "success",
      });
      setCreateData(initialCreateData);
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || "Failed to create transaction",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback(null);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  // Remove row from the table once the backend has deleted it
  const handleDeleteConfirmed = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.sparePartTransactionId !== id));
  };

  function renderActionButtons(params: GridCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => handleDelete(params.row.sparePartTransactionId as number)}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  const columns: GridColDef[] = [
    { field: "id", flex: 1, headerName: "ID", width: 80 },
    { field: "partNumber", flex: 1, headerName: "Part Number", width: 150 },
    { field: "partName", flex: 1, headerName: "Part Name", width: 200 },
    { field: "manufacturer", flex: 1, headerName: "Manufacturer", width: 200 },
    { field: "quantity", flex: 1, headerName: "Quantity", width: 120 },
    { field: "amount", flex: 1, headerName: "Amount", width: 150 },
    { field: "total", flex: 1, headerName: "Total", width: 150 },
    {
      field: "",
      flex: 1,
      headerName: "Action",
      width: 120,
      renderCell: (params) => renderActionButtons(params),
    },
  ];
  const grandTotal = rows.reduce((acc, row) => acc + (row.total as number), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h6">
          Add Vehicle Service Parts
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      <form onSubmit={handleCreateSubmit}>
        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partName">Part Name (Type & Search)</FormLabel>
            {createData.partName && createData.manufacturer ? (
              <OutlinedInput
                value={`${createData.partName} - ${createData.manufacturer}`}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSelection}>
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
                fullWidth
                disabled
              />
            ) : (
              <>
                <TextField
                  name="partName"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Type to search spare parts..."
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                {partSuggestions.length > 0 && (
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      mt: 1,
                      maxHeight: 200,
                      overflowY: "auto",
                    }}
                  >
                    {partSuggestions.map((suggestion) => (
                      <Box
                        key={suggestion.sparePartId}
                        sx={{
                          p: 1,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion.manufacturer} - {suggestion.partName} - {suggestion.description}
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partNumber">Part Number</FormLabel>
            <OutlinedInput
              name="partNumber"
              value={createData.partNumber}
              onChange={handleCreateChange}
              placeholder="Auto-filled Part Number"
              size="small"
              required
              disabled
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <OutlinedInput
              name="quantity"
              value={createData.quantity}
              onChange={handleCreateChange}
              type="number"
              size="small"
              required
              inputProps={{ min: 1 }}
            />
          </FormGrid>

          {/* If you want the user to edit the price manually, add an Amount field: */}
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <OutlinedInput
              name="amount"
              value={createData.amount}
              onChange={handleCreateChange}
              type="number"
              size="small"
              required
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Transaction
            </Button>
          </FormGrid>
        </Grid>
      </form>

      {rows.length !== 0 && (
        <>
          <FormGrid container spacing={2} columns={12} mt={4}>
            <FormGrid>
              <CustomizedDataGrid columns={columns} rows={rows} />
            </FormGrid>
          </FormGrid>
          {/* Grand Total display */}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Typography variant="h6">
              Grand Total: {grandTotal}
            </Typography>
          </Box>
        </>
      )}

      <SparePartDeleteModel
        open={open}
        onClose={() => setOpen(false)}
        deleteItemId={selectedId}
        onDelete={handleDeleteConfirmed}
      />

      {feedback && (
        <Snackbar
          open={!!feedback}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={feedback.severity}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AddVehiclePartService;
