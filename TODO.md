# Extracurricular Builder TODO List

## High Priority
- [ ] Replace in-memory rate limiting with persistent storage (e.g., Redis) for production
  - Currently rate limits reset on server restart
  - Need proper distributed rate limiting for production scale
  - Consider using Redis or similar for storing rate limit data

## Future Improvements
- [ ] Add user authentication to track rate limits per user
- [ ] Add admin dashboard for monitoring rate limits
- [ ] Implement rate limit warning headers
- [ ] Add automated tests for rate limiting logic
