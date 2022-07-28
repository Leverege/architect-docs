#/bin/bash
JQ_LOCATION=$(which jq)

PROJECT=$1
TARGET=$2

if [ -z $PROJECT ]
then
	if [ -z $JQ_LOCATION ]
	then
		echo "To run, please install jq (brew install jq)"
		exit
	fi

	PROJECT="$(cat .firebaserc | jq -r '.targets | to_entries[] | "\(.key)"' | fzf)"
	if [ -z $PROJECT ]
	then
		echo "Please specify a firebase project"
		exit
	fi
fi

if [ -z $TARGET ]
then
	if [ -z $JQ_LOCATION ]
	then
		echo "To run, please install jq (npm install -g jq)"
		exit
	fi
	
	TARGET="$(cat .firebaserc| jq -r --arg project $PROJECT '.targets[$project].hosting | to_entries[] | "\(.key)"' | fzf)"
	if [ -z $TARGET ]
	then
		echo "Please specify a firebase hosting bucket"
		exit
	fi
fi

echo "Firebase Project: $PROJECT"
echo "Firebase Hosting Bucket: $TARGET"

npm run clean && npm run build && firebase use $PROJECT && firebase deploy --only hosting:$TARGET
