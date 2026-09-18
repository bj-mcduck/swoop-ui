# Swoop UI Study

A lightweight Rails 8 + Hotwire reproduction of the public Swoop homepage,
created as a baseline for a portfolio redesign exercise.

## Run it

```sh
bundle install
bin/rails server
```

Open <http://localhost:3000>. The page uses Turbo and small Stimulus
controllers for its mega-menu, solution tabs, mobile navigation, and video
dialog. No Node.js build step is required.

## Test it

```sh
bin/rails test
```

This concept is unaffiliated with Swoop and uses recreated interface patterns
for design exploration only.
## Deploying to Render

The repository includes a `render.yaml` Blueprint for a single Ruby web
service. This visual concept does not currently read or write application data,
so it does not need a database or persistent disk.

Create a new Blueprint in Render and connect this repository. When Render asks
for `RAILS_MASTER_KEY`, copy the single-line value from the local
`config/master.key` file. Never commit that key to Git.

For an existing Render web service, use these settings:

- Build command: `bundle install && bin/rails assets:precompile`
- Start command: `bundle exec puma -C config/puma.rb`
- Health check path: `/up`
- Environment: `RAILS_ENV=production`, `WEB_CONCURRENCY=1`, and the correct
  `RAILS_MASTER_KEY`

An `ActiveSupport::MessageEncryptor::InvalidMessage` or `AEAD authentication
tag verification failed` error means the configured master key does not match
`config/credentials.yml.enc`. Replace the environment variable instead of
generating a new key; regenerating credentials would invalidate the encrypted
file already committed to the repository.
