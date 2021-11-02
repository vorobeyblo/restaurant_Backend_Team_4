import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CIForm from '../ciForm/CIForm';
import { Container } from '@mui/material';
/* 
interface ICatIng{
    id: number;
    title: string
} */

export default function CatIngDialog({type, handleClose}: any ) {
  const initialItems: any = [];
  const theme = useTheme();
  return (
    <div>
      <Dialog
        fullWidth
        open={type && true}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
        <Container sx={{p: theme.spacing(3), textAlign: "center"}}><Typography sx={{ ml: 2, flex: 1 }} variant="h3">
         Edit {type==="ingredient" ? "ingredient" : "categorie"}s
        </Typography>
        </Container>
        </DialogTitle>
        <DialogContent>
          
<CIForm type={type} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}