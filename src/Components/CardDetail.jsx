import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

export default function CardDetail({ 
  title, 
  price, 
  unit, 
  note, 
  icon, 
  priceColor = "grey.600", // color opcional
  showCurrency = true // mostrar símbolo de moneda (S/)
}) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "grey.100" }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography
              variant="h4"
              color={priceColor} // aquí aplicamos el color recibido
              sx={{ fontWeight: "bold" }}
            >
              {showCurrency ? `S/${price}` : price}{" "}
              <Typography component="span" variant="body2">
                {unit} {note && `(${note})`}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
