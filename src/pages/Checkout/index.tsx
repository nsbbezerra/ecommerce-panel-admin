import { Fragment, MouseEvent, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { FaDollarSign } from "react-icons/fa";
import { grey } from "@mui/material/colors";
import { BsCaretDown } from "react-icons/bs";

export default function Checkout() {
  const [paymentMode, setPaymentMode] = useState<string>("checkout");

  const handleChange = (event: MouseEvent<HTMLElement>, nextView: string) => {
    setPaymentMode(nextView);
  };

  return (
    <Fragment>
      <AppBar title="Checkout" />

      <Container>
        <Box p={"20px"}>
          <Paper
            elevation={0}
            sx={{
              boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
              padding: 2,
              width: "fit-content",
            }}
          >
            <Box
              display={"flex"}
              gap={1}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              <Box
                color={grey["700"]}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <FaDollarSign />
                <Typography fontWeight={"500"}>Modo de pagamento:</Typography>
              </Box>
              <ToggleButtonGroup
                color="primary"
                value={paymentMode}
                onChange={handleChange}
                exclusive
              >
                <ToggleButton value={"checkout"}>Checkout Online</ToggleButton>
                <ToggleButton value={"manual"}>Manual</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} lg={8}>
              <DefaultContainer disabledPadding>sasdas</DefaultContainer>

              <Box mt={2}>
                <Accordion
                  elevation={0}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    border: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<BsCaretDown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Pagar com PIX</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  elevation={0}
                  sx={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)" }}
                >
                  <AccordionSummary
                    expandIcon={<BsCaretDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Pagar com Cartão de Crédito</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  elevation={0}
                  sx={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)" }}
                >
                  <AccordionSummary
                    expandIcon={<BsCaretDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Pagar com Cartão de Crédito</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <DefaultContainer disabledPadding></DefaultContainer>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
}
