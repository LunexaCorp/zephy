/* Recuperado de : https://mui.com/material-ui/react-card/#media*/

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';

interface MediaCardProps {
    id: string;
    image: string;
    title: string;
    description: string;
}

export default function MediaCard({id, image, title, description} : MediaCardProps)  {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <EditButton locationId={id} />
        <DeleteButton locationId={id} />
      </CardActions>
    </Card>
  );
}
