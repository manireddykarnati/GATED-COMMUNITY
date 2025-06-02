import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Typography,
  Fade,
  Chip,
  Box,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import paymentHistoryData from "../data/paymentHistoryData";

// 🔁 Animated gradient background
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  background: "linear-gradient(-45deg, #1e3c72, #2a5298, #00c6ff, #0072ff)",
  backgroundSize: "400% 400%",
  animation: `${animatedGradient} 15s ease infinite`,
  filter: "blur(10px) brightness(0.7)",
});

// 💳 Styled animated card
const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
  zIndex: 2,
  animation: "fadeIn 1s ease-in-out",
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)",
  backdropFilter: "blur(12px)",
  boxShadow: theme.shadows[4],
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at top left, ${theme.palette.primary.light}33, transparent 70%)`,
    animation: "pulseBackground 6s ease-in-out infinite",
    zIndex: -1,
    pointerEvents: "none",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes pulseBackground": {
    "0%": { opacity: 0.2, transform: "scale(1)" },
    "50%": { opacity: 0.4, transform: "scale(1.05)" },
    "100%": { opacity: 0.2, transform: "scale(1)" },
  },
}));

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "overdue":
      return "error";
    default:
      return "default";
  }
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const PaymentHistory = () => (
  <Fade in timeout={500}>
    <Box sx={{ position: "relative", minHeight: "100vh", px: 3, py: 5 }}>
      <Background />
      <StyledCard>
        <CardHeader
          title="Payment History"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <TableContainer>
            <Table aria-label="Payment history table">
              <TableHead>
                <TableRow>
                  {["Plot Number", "Amount Paid", "Payment Date", "Payment Method", "Status"].map(
                    (header) => (
                      <TableCell key={header}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {header}
                        </Typography>
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistoryData.map(
                  ({ id, plotNumber, amountPaid, paymentDate, paymentMethod, status }) => (
                    <TableRow key={id} hover>
                      <TableCell>{plotNumber}</TableCell>
                      <TableCell>{formatCurrency(amountPaid)}</TableCell>
                      <TableCell>{new Date(paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{paymentMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          color={getStatusColor(status)}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    </Box>
  </Fade>
);

export default memo(PaymentHistory);
