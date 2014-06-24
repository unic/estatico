#!/bin/bash

echo "



██████╗ ███████╗██████╗ ███████╗███╗   ██╗██████╗ ███████╗███╗   ██╗ ██████╗██╗███████╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔════╝████╗  ██║██╔════╝██║██╔════╝██╔════╝
██║  ██║█████╗  ██████╔╝█████╗  ██╔██╗ ██║██║  ██║█████╗  ██╔██╗ ██║██║     ██║█████╗  ███████╗
██║  ██║██╔══╝  ██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║██╔══╝  ██║╚██╗██║██║     ██║██╔══╝  ╚════██║
██████╔╝███████╗██║     ███████╗██║ ╚████║██████╔╝███████╗██║ ╚████║╚██████╗██║███████╗███████║
╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝╚══════╝╚══════╝

"

# Install NPM dependencies using npm-pkgr (caching modules)
npm-pkgr --strategy=copy

# Install Bower dependencies
node node_modules/.bin/bower install

# Ruby environment (for Sass)
source /usr/local/rvm/scripts/rvm
rvm use 2.0.0

echo "



██████╗ ██╗   ██╗██╗██╗     ██████╗
██╔══██╗██║   ██║██║██║     ██╔══██╗
██████╔╝██║   ██║██║██║     ██║  ██║
██╔══██╗██║   ██║██║██║     ██║  ██║
██████╔╝╚██████╔╝██║███████╗██████╔╝
╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝

"

echo "
-------------------------------------------------------
Build Dev Version
-------------------------------------------------------
"

if ! node_modules/gulp/bin/gulp.js build
	then
		exit 1
fi

if [ ! -d "build" ]
	then
		echo "[ERROR] DEV build failed (no build directory detected)."
		exit 1
fi

mv build dev

echo "
-------------------------------------------------------
Build Prod Version
-------------------------------------------------------
"

if ! node_modules/gulp/bin/gulp.js build --production
	then
		exit 1
fi

if [ ! -d "build" ]
	then
		echo "[ERROR] PROD build failed (no build directory detected)."
		exit 1
fi

mv build prod

# Create structure for preview server
mkdir build
mv dev build/dev
mv prod build/prod

echo "
-------------------------------------------------------
Save Metadata
-------------------------------------------------------
"

build_type="snapshot"

if [ -n "${RELEASE}" ]
	then
		build_type="release"
fi

timestamp="${BUILD_ID/_/-}"

# Write meta data to JSON file (for preview server, e.g.)
metadata="{\"prototype-name\":\"${PROTOTYPE_NAME}\",\"build-timestamp\":\"$timestamp\",\"build-type\":\"$build_type\",\"build-branch\":\"${GIT_BRANCH}\",\"build-version\":\"${BUILD_NUMBER}\",\"build-url\":\"${BUILD_URL}api/json\",\"repo-url\":\"${GIT_REPO_URL}\"}"
echo "$metadata" > ./build/metadata.json
echo "$metadata saved to build/metadata.json"

echo "



██████╗ ██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
██╔══██╗██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
██████╔╝██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║    ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
██╔═══╝ ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
██║     ██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝

"

echo "
-------------------------------------------------------
Upload build to preview server
Pre-configure on http://fe-preview.unic.com
-------------------------------------------------------"

if [ -n "${PREVIEW_CURL_PASSWORD}" ]
	then
		cd build
		zip -r ../${PROTOTYPE_NAME}-${timestamp}.zip *
		cd ..
		statuscode=$(curl --silent --output /dev/stderr --write-out "%{http_code}" -u upload:${PREVIEW_CURL_PASSWORD} -v --upload-file ${PROTOTYPE_NAME}-${timestamp}.zip http://fe-preview.unic.com/upload)
		rm -f ${PROTOTYPE_NAME}-${timestamp}.zip

		if [ $statuscode -ne 201 ]
			then
				echo "[ERROR] cURL response: $statuscode."
				exit 1
		fi
	else
		echo "[ERROR] No cURL password for preview server provided."
		exit 1
fi

echo "



 ██████╗ ██╗████████╗
██╔════╝ ██║╚══██╔══╝
██║  ███╗██║   ██║
██║   ██║██║   ██║
╚██████╔╝██║   ██║
 ╚═════╝ ╚═╝   ╚═╝

"

echo "
-------------------------------------------------------
Push HTML and assets (if not specified otherwise)
-------------------------------------------------------
"

if [ -n "${BUILD_GIT_REPO}" ] && [ -n "${BUILD_GIT_BRANCH}" ]
	then
		# Create temp folder
		mkdir build.tmp
		cd build.tmp

		# Init new repo and checkout build branch (has to pre-exist)
		git init

		if ! git remote add -t ${BUILD_GIT_BRANCH} -f origin ${BUILD_GIT_REPO}
			then
				echo "[ERROR] Adding git remote failed. Build branch might be missing."
				exit 1
		fi

		git checkout ${BUILD_GIT_BRANCH}

		# Sync files from dev build to temp folder
		if [ -n "${PUSH_ASSETS}" ]
			then
				rsync -rm --delete --exclude '.git' --exclude 'metadata.json' ../build/ .
			else
				rsync -rm --delete --exclude '.git' --include '*.html' -f 'hide,! */' ../build/dev/ .
		fi

		# Push changes
		git add --all
		git commit -m "Build ${BUILD_NUMBER}"
		git push origin ${BUILD_GIT_BRANCH}
	else
		echo "[ERROR] No repo or branch specified."
		exit 1
fi

echo "


███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝

"

echo "
-------------------------------------------------------
Use maven to deploy to Nexus
Make sure to edit the groupId property in jenkins/pom.xml
(replace 'gulp-boilerplate' with the projects name or ask the backend for a specific configuration)
-------------------------------------------------------
"
