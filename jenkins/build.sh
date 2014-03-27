#!/bin/bash

echo "
-------------------------------------------------------
 B U I L D
-------------------------------------------------------"


echo "
-------------------------------------------------------
Install Dependencies
-------------------------------------------------------"

npm install

# Ruby environment (for compass)
#source /usr/local/rvm/scripts/rvm
#rvm use 2.0.0


echo "
-------------------------------------------------------
Build
-------------------------------------------------------"

# Pre-run Modernizr task due to weird issues
grunt modernizr
grunt modernizr

# Main build task
grunt build


echo "
-------------------------------------------------------
Save Metadata
-------------------------------------------------------"

build_type="snapshot"

if [ RELEASE -eq "true" ]
	then
		build_type="release"
fi

timestamp="${BUILD_ID/_/-}"

# if [ -n RELEASE_VERSION ]
#   then
#     build_type="release"
#     build_version="${RELEASE_VERSION}"
#   else
#     build_type="snapshot"
#     build_version="${DEVELOPMENT_VERSION}-SNAPSHOT"
# fi

# echo "$build_type $build_version"

# Write meta data to JSON file (for preview server, e.g.)
metadata="{\"prototype-name\":\"${PROTOTYPE_NAME}\",\"build-timestamp\":\"$timestamp\",\"build-type\":\"$build_type\",\"build-branch\":\"${GIT_BRANCH}\",\"build-version\":\"${BUILD_NUMBER}\",\"build-url\":\"${BUILD_URL}api/json\",\"repo-url\":\"${GIT_REPO_URL}\"}"
echo "$metadata" > ./build/metadata.json
echo "$metadata saved to build/metadata.json"


echo "
-------------------------------------------------------
Upload build to preview server
-------------------------------------------------------"

if [ -n PREVIEW_CURL_PASSWORD ]
	then
		cd web
		zip -r ../${PROTOTYPE_NAME}-${timestamp}.zip *
		cd ..
		curl -u upload:${PREVIEW_CURL_PASSWORD} -v --upload-file ${PROTOTYPE_NAME}-${timestamp}.zip http://fe-dev-preview.unic.com/upload
	else
		echo "[WARNING] No cURL password specified"
fi


echo "
-------------------------------------------------------
Push HTML (plus assets, if specified) to build branch
-------------------------------------------------------"

if [ -n BUILD_GIT_REPO ] && [ -n BUILD_GIT_BRANCH ]
	then
		# Create temp folder
		mkdir build.tmp
		cd build.tmp

		# Init new repo and checkout build branch (has to pre-exist)
		git init
		git remote add -t ${BUILD_GIT_BRANCH} -f origin ${BUILD_GIT_REPO}
		git checkout ${BUILD_GIT_BRANCH}

		# Sync files from dev build to temp folder
		if [ -n PUSH_ASSETS ]
			then
				rsync -rm --delete --exclude='.git' ../web/ .
			else
				rsync -rm --delete --exclude='.git' --include='*.html' -f 'hide,! */' ../web/ .
		fi

		# Push changes
		git add --all
		git commit -m "Build ${BUILD_NUMBER}"
		git push origin ${BUILD_GIT_BRANCH}
	else
		echo "[WARNING] No repo or branch specified!"
fi



echo "
-------------------------------------------------------
 D E P L O Y
-------------------------------------------------------"

# E.g. Jenkins task to push to Nexus
