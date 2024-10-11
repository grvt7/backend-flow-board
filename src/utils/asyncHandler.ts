import { Request, Response, NextFunction } from 'express';

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export default asyncHandler;

// PORT=8000
// MONGODB_URI=mongodb+srv://grvt:Pac--code1099@cluster0.ownjc.mongodb.net
// CORS_ORIGIN=*
// ACCESS_TOKEN_SECRET=XSve265y4XY08IZDWB6bRZaAWAzUqysXWhekA9wZ8QmHeR5qml4VIJ75wcLa34E1YpttbpLCh4pRZSSKz2tygz6irUw6j5vs1ggXMTxdr28ciCUkDOcJpVrcDHj8FbMIVPDERCG5w70HsjRZALaYgdZo95u216FDfB587VBYGkOXB6TzWdZFjWsp1xGyxhl2ZExxEgiEC7CihWWa9zBf86IprhJ7xOgT5CWW6U79kAZB0VmwgXfPQfSwLgrXx7l7
// ACCESS_TOKEN_EXPIRY=15m
// REFRESH_TOKEN_SECRET=2BLewwRlB62Cv0oetRvI3vpdsLbksTEACxyR7oi5zIx6ttttzWlmeP8FkRai167RXG0Iw4ofCqEHPKuc1j8KpQudZAFPJDI5TT6lm1m9ECO07k2lOxFCs2zV1uP4Ok0zO9Jgv0FaTKOgL31vESSm95FuCPyfDQX6iILscxQMwTHJf7ixZJvxrcuT72fuL3omcZDJ0ZkLEsWoUyLwJGmEfgmRPwuZ7HCzyoGm9sbQB5mEGUQ8RGBEqeHpL5dGKiquo8tD71PZuITkrm3kGraXV26WGYKi2djwG5fFHU9U5F5KTRivdqPZyBrH7JUyAke6cgpvOqt0ZTRM5vBSwWyFP6pDkHd6RutHpE5qkUjo9chcq17cmqc56sp4OGXSPxVw6FVpF4wYVfcghYm7uzYDSGJpRGVTjXUGVHCJE8GSi16XDqVCFUSCCF1cSKLK21qtCyP3oQTCvmm5LpfQ0A1lcrCH3xhzq09Xwzc1XCVs9rC6zKL4BEQsZtEP12KBIMQ3
// REFRESH_TOKEN_EXPIRY=30d

// # CLOUDINARY_CLOUD_NAME=
// # CLOUDINARY_API_KEY=
// # CLOUDINARY_API_SECRET=
