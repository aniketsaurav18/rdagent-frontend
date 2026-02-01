"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Youtube, Twitter, Facebook, Plus } from "lucide-react"
import { YouTubeAnalysis } from "./youtube-analysis"
import { TwitterAnalysis } from "./twitter-analysis"
import { FacebookAnalysis } from "./facebook-analysis"
import { AddSocialLinksDialog } from "./add-social-link-dialog"




type SocialLinks = {
  [key: string]: string[]
}

interface SocialMediaDashboardProps {
  youtubeData?: any
  twitterData?: any
  facebookData?: any
  projectId?: string
  userId?: number
  companyUrl?: string
  existingLinks?: SocialLinks
  onLinksUpdated?: (data: any) => void
}

export function SocialMediaDashboard({
  youtubeData,
  twitterData,
  facebookData,
  projectId,
  userId,
  companyUrl,
  existingLinks = {},
  onLinksUpdated,
}: SocialMediaDashboardProps) {
  const [activeTab, setActiveTab] = useState("youtube")
  const [showAddLinksDialog, setShowAddLinksDialog] = useState(false)

  // Use provided data or fall back to undefined (no sample data)
  const youtube = youtubeData
  const twitter = twitterData
  const facebook = facebookData

  // Helper to check if social media data is empty or missing
  const isEmptyData = (data: any): boolean => {
    if (!data) return true
    if (typeof data === 'object' && Object.keys(data).length === 0) return true
    // Also check if it has success: false or no meaningful data
    if (data.success === false) return true
    if (!data.data && !data.report) return true
    return false
  }

  // Check if any social media data is missing or empty
  const hasMissingData = isEmptyData(youtube) || isEmptyData(twitter) || isEmptyData(facebook)

  // Check if we can show the add links dialog (need at least projectId)
  const canAddLinks = Boolean(projectId)

  // Show the button if we have missing data, regardless of whether we can fully submit
  const showAddButton = hasMissingData || canAddLinks

  const handleLinksSuccess = (data: any) => {
    onLinksUpdated?.(data)
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Links button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Social Media Analysis</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analyze social media presence and engagement metrics
          </p>
        </div>
        {showAddButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddLinksDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Social Links
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="mt-6">
          {!isEmptyData(youtube) ? (
            <YouTubeAnalysis data={youtube} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Youtube className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold">No YouTube Data</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">YouTube analysis data is not available.</p>
                {showAddButton && (
                  <Button
                    variant="default"
                    onClick={() => setShowAddLinksDialog(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add YouTube Link Manually
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="twitter" className="mt-6">
          {!isEmptyData(twitter) ? (
            <TwitterAnalysis data={twitter} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Twitter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold">No Twitter Data</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Twitter analysis data is not available.</p>
                {showAddButton && (
                  <Button
                    variant="default"
                    onClick={() => setShowAddLinksDialog(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Twitter Link Manually
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facebook" className="mt-6">
          {!isEmptyData(facebook) ? (
            <FacebookAnalysis data={facebook} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Facebook className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold">No Facebook Data</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Facebook analysis data is not available.</p>
                {showAddButton && (
                  <Button
                    variant="default"
                    onClick={() => setShowAddLinksDialog(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Facebook Link Manually
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Social Links Dialog */}
      <AddSocialLinksDialog
        open={showAddLinksDialog}
        onOpenChange={setShowAddLinksDialog}
        projectId={projectId || ""}
        userId={userId || 0}
        companyUrl={companyUrl || ""}
        existingLinks={existingLinks}
        onSuccess={handleLinksSuccess}
      />
    </div>
  )
}
