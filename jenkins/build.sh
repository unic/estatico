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

# Ruby environment (for Sass)
source /usr/local/rvm/scripts/rvm
rvm use 2.0.0


echo "
-------------------------------------------------------
Build Dev Version
-------------------------------------------------------"

node_modules/gulp/bin/gulp.js setup
node_modules/gulp/bin/gulp.js build

if [ ! -d "build" ]
	then
		echo "[ERROR] DEV build failed (no build directory detected)"
		exit
fi

mv build dev


echo "
-------------------------------------------------------
Build Prod Version
-------------------------------------------------------"

node_modules/gulp/bin/gulp.js setup
node_modules/gulp/bin/gulp.js build --production

if [ ! -d "build" ]
	then
		echo "[ERROR] PROD build failed (no build directory detected)"
		exit
fi

mv build prod

# Create structure for preview server
mkdir build
mv dev build/dev
mv prod build/prod


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
Upload build to preview server (has to be pre-configured on http://fe-preview.unic.com/)
-------------------------------------------------------"

if [ -n PREVIEW_CURL_PASSWORD ]
	then
		cd build
		zip -r ../${PROTOTYPE_NAME}-${timestamp}.zip *
		cd ..
		curl -u upload:${PREVIEW_CURL_PASSWORD} -v --upload-file ${PROTOTYPE_NAME}-${timestamp}.zip http://fe-preview.unic.com/upload
		rm -f ${PROTOTYPE_NAME}-${timestamp}.zip
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
				rsync -rm --delete --exclude='.git' --exclude='metadata.json' ../build/ .
			else
				rsync -rm --delete --exclude='.git' --include='*.html' -f 'hide,! */' ../build/dev/ .
		fi

		# Push changes
		git add --all
		git commit -m "Build ${BUILD_NUMBER}"
		git push origin ${BUILD_GIT_BRANCH}

		#cd ..
		#rm -rf build.tmp
	else
		echo "[WARNING] No repo or branch specified!"
fi



echo "
-------------------------------------------------------
 D E P L O Y (optional, use maven to deploy to Nexus)
-------------------------------------------------------

Ask the backend for a pom.xml
"
