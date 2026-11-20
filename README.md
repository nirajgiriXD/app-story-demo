# Tasky

A tiny task list (plain HTML, CSS and JavaScript) for trying the
[AppStory](https://github.com/nirajgiriXD/app-story) GitHub Action.

Live site: https://nirajgirixd.github.io/app-story-demo/

## Run it locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080/.

## Demo videos

`apps/tasky.md` describes the app to AppStory. The **Demo videos** workflow serves the site
on the runner and uses the AppStory action from its `main` branch to check the saved plans
and make their videos again. The videos are uploaded as a workflow artifact.

The first plan is made locally, with an AI key in `.env`:

```bash
python -m http.server 8080     # terminal 1
app-story tasky                # terminal 2: plans, records and saves apps/tasky.plans/
```

Commit `apps/tasky.plans/`, and the workflow takes it from there, with no AI key.
