import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";

import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const token = localStorage.getItem("token");
  const productId = product["_id"];
  const qty = 1;

  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt={product.name}
        height="auto"
        image={product.image}
        className="product-img"
      />
      <CardContent>
        <Typography gutterBottom level="title-lg" component="div">
          {product.name}
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: "bold" }}>
          ${product.cost}
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
          readOnly
          sx={{ marginTop: "5px" }}
        />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          className="card-button"
          size="large"
          variant="contained"
          fullWidth
          onClick={() =>
            handleAddToCart(token, null, null, productId, qty, {
              preventDuplicate: true,
            })
          }
        >
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
