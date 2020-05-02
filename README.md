[![Build Status](https://cloud.drone.io/api/badges/rpiambulance/whoson/status.svg)](https://cloud.drone.io/rpiambulance/whoson)

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)


# whoson
**whoson** is a Slack integration that allows members to see who is scheduled for night shifts.

## Integration mechanics
Using **whoson** is easy! In its most basic form, the integration can be run by typing `/whoson` into a Slack channel. This will return:

* Tonight's crew—if between 0900 and 1800 hours
* The current crew—if between 1800 and 0600 hours
* Last night and tonight's crews—if between 0600 and 0900 hours

### Other commands
**whoson** can also display other days' crews, including yesterday and any day up to a week from now.

Simply run `/whoson <parameter>` to get the desired response. Parameters are case-insensitive and include:

- `Monday`, `Tuesday`, or any other day of the week
  - Tip: you can abbreviate days of the week! Try `Mon` or `Thurs`, for instance
- `Yesterday` or `yest`
- `Tomorrow` or `tom`
- `Week`

As a note, if you type the current day of the week, **whoson** will return the crew for *a week from today*. That is, if it is currently Wednesday, running `/whoson wed` will return *next* Wednesday's crew.

## Important files
**whoson** runs on the web server, using [a php file](https://github.com/rpiambulance/website/blob/master/slack-whoson.php) to grab database data. This integration will, eventually, be incorporated into [rampart](https://github.com/rpiambulance/rampart).

## Documentation
Generate JSDocs by running `jsdoc -R README.md -d docs/ utilities/*.js server.js`.


## Credits

### Developers

- [Dan Bruce](https://github.com/ddbruce)

### License

**whoson** is provided under the [MIT License](https://opensource.org/licenses/MIT).

### Contact

For any question, comments, or concerns, email [dev@rpiambulance.com](mailto:dev@rpiambulance.com), [create an issue](https://github.com/rpiambulance/whoson/issues/new), or open up a pull request.
