# CSE564_Visualization_Lab2B

Task 4: MDS plots (numerical data dimensions only)
  - (a) construct the data MDS plot (use the Euclidian distance) and visualize it via a scatterplot (use metric MDS – python sklearn.manifold.MDS)
  - color the points by cluster ID (see task 3 in Lab 2(A) )
  - (b) construct the variables’ MDS plot (use the (1-|correlation|) distance) and visualize it via a scatterplot (also here, use metric MDS)

Task 5: parallel coordinates plot (PCP)
  - visualize the data in a parallel coordinates plot (all data dimensions, categorical and numerical)
  - come up with a meaningful axes ordering by user interaction
  - color the polylines by cluster ID (see task 3 in Lab 2(A))

Task 6: find a good PCP axes ordering from correlations
  - numerical values only: use the correlations observed in the variables’ MDS plot to help with the axis ordering -- the user would click on points in sequence and the axes would be arranged in that sequence
