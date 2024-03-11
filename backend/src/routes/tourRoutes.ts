import { ApiRequest } from 'app';
import express, { Request, Response } from 'express';
import { readFileSync, writeFile } from 'fs';

const tours = JSON.parse(
  readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8'),
) as any[];

const getTour = (req: Request, res: Response): any => {
  console.log(req.params);
  const id = parseInt(req.params.id); //convert to int
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      reason: `Unable to find tour with id of ${id}`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req: Request, res: Response): any => {
  const id = parseInt(req.params.id); //convert to int
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid Id',
      },
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req: Request, res: Response): any => {
  const id = parseInt(req.params.id); //convert to int
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid Id',
      },
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const postTour = (req: Request, res: Response) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const getAllTours = (req: ApiRequest, res: Response) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const router = express.Router();

router.route('/').get(getAllTours).post(postTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;